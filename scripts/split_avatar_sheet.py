"""
Нарезает PNG-стикерпак на отдельные спрайты.

Если альфа везде 255 (нет прозрачности), используется маска по насыщенности
(chroma = max(R,G,B) - min(R,G,B)), чтобы отделить рисунок от серой «шахматки».

Запуск из корня репозитория:
  python scripts/split_avatar_sheet.py
  python scripts/split_avatar_sheet.py --chroma 12 --min-area 400

Вход:  client/public/avatar-assets/sheet.png
Выход: client/public/avatar-assets/layers/sprite_XX.png + manifest.json
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SHEET = ROOT / "client/public/avatar-assets/sheet.png"
OUT_DIR = ROOT / "client/public/avatar-assets/layers"
PADDING = 6


def label_components(mask: np.ndarray) -> tuple[int, np.ndarray]:
    h, w = mask.shape
    labels = np.zeros((h, w), dtype=np.int32)
    current = 0
    nbrs = ((1, 0), (-1, 0), (0, 1), (0, -1))
    for y in range(h):
        for x in range(w):
            if not mask[y, x] or labels[y, x]:
                continue
            current += 1
            stack = [(y, x)]
            while stack:
                cy, cx = stack.pop()
                if cy < 0 or cy >= h or cx < 0 or cx >= w:
                    continue
                if not mask[cy, cx] or labels[cy, cx]:
                    continue
                labels[cy, cx] = current
                for dy, dx in nbrs:
                    stack.append((cy + dy, cx + dx))
    return current, labels


def build_mask_from_rgba(arr: np.ndarray, chroma_threshold: int | None) -> np.ndarray:
    """True = пиксель относится к спрайту (не фон)."""
    alpha = arr[:, :, 3]
    # Есть настоящая прозрачность
    if alpha.max() < 250 or (alpha < 250).mean() > 0.001:
        return alpha > 25

    rgb = arr[:, :, :3]
    chroma = rgb.max(axis=2) - rgb.min(axis=2)
    if chroma_threshold is None:
        chroma_threshold = 12
    return chroma >= chroma_threshold


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("sheet", nargs="?", type=Path, default=DEFAULT_SHEET)
    ap.add_argument("--chroma", type=int, default=None, help="Порог chroma, если нет альфы (по умолчанию 12)")
    ap.add_argument("--min-area", type=int, default=500)
    ap.add_argument("--max-area", type=int, default=120000)
    args = ap.parse_args()

    sheet_path = args.sheet
    if not sheet_path.is_file():
        print(f"File not found: {sheet_path}", file=sys.stderr)
        return 1

    img = Image.open(sheet_path).convert("RGBA")
    arr = np.array(img)
    mask = build_mask_from_rgba(arr, args.chroma)

    nlab, labels = label_components(mask)
    if nlab == 0:
        print("No opaque regions.", file=sys.stderr)
        return 1

    entries: list[dict] = []
    for lid in range(1, nlab + 1):
        ys, xs = np.where(labels == lid)
        area = int(len(xs))
        if area < args.min_area or area > args.max_area:
            continue
        y0, y1 = int(ys.min()), int(ys.max())
        x0, x1 = int(xs.min()), int(xs.max())
        cy = float(ys.mean())
        cx = float(xs.mean())
        entries.append({"label": lid, "area": area, "bbox": [x0, y0, x1, y1], "center": [cx, cy]})

    entries.sort(key=lambda e: (e["center"][1], e["center"][0]))

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    manifest: list[dict] = []

    for i, e in enumerate(entries, start=1):
        x0, y0, x1, y1 = e["bbox"]
        x0p = max(0, x0 - PADDING)
        y0p = max(0, y0 - PADDING)
        x1p = min(img.width - 1, x1 + PADDING)
        y1p = min(img.height - 1, y1 + PADDING)
        crop = img.crop((x0p, y0p, x1p + 1, y1p + 1))
        sub = mask[y0p : y1p + 1, x0p : x1p + 1]
        ys, xs = np.where(sub)
        if len(xs) > 0:
            yy0, yy1 = int(ys.min()), int(ys.max())
            xx0, xx1 = int(xs.min()), int(xs.max())
            crop = crop.crop((xx0, yy0, xx1 + 1, yy1 + 1))
        name = f"sprite_{i:02d}.png"
        out_path = OUT_DIR / name
        crop.save(out_path)
        manifest.append(
            {
                "file": f"avatar-assets/layers/{name}",
                "index": i,
                "area": e["area"],
                "bbox_sheet": [x0p, y0p, x1p + 1, y1p + 1],
                "center_sheet": e["center"],
            }
        )

    is_alpha = arr[:, :, 3].max() < 250 or (arr[:, :, 3] < 250).mean() > 0.001
    try:
        src_rel = str(sheet_path.relative_to(ROOT))
    except ValueError:
        src_rel = str(sheet_path)
    meta = {
        "source": src_rel,
        "split": {
            "mode": "alpha" if is_alpha else "chroma",
            "chroma_threshold": None if is_alpha else (args.chroma if args.chroma is not None else 12),
            "min_area": args.min_area,
            "max_area": args.max_area,
        },
        "sprites": manifest,
    }

    meta_path = OUT_DIR / "manifest.json"
    meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"Saved layers: {len(manifest)} -> {OUT_DIR}")
    print(f"Manifest: {meta_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
