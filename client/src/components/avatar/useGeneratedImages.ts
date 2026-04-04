import { useEffect, useState } from 'react';

export function useLoadedImage(src: string | null): HTMLImageElement | null {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!src) {
      setImg(null);
      return;
    }
    let cancelled = false;
    const i = new window.Image();
    i.crossOrigin = 'anonymous';
    i.onload = () => {
      if (!cancelled) setImg(i);
    };
    i.onerror = () => {
      if (!cancelled) setImg(null);
    };
    i.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);
  return img;
}

export function useLoadedImages(urls: (string | null)[]): Map<string, HTMLImageElement | null> {
  const key = urls.filter(Boolean).join('|');
  const [map, setMap] = useState<Map<string, HTMLImageElement | null>>(() => new Map());

  useEffect(() => {
    const unique = [...new Set(urls.filter((u): u is string => Boolean(u)))];
    if (unique.length === 0) {
      setMap(new Map());
      return;
    }
    let cancelled = false;
    Promise.all(
      unique.map(
        (url) =>
          new Promise<{ url: string; img: HTMLImageElement | null }>((resolve) => {
            const i = new window.Image();
            i.crossOrigin = 'anonymous';
            i.onload = () => resolve({ url, img: i });
            i.onerror = () => resolve({ url, img: null });
            i.src = url;
          })
      )
    ).then((results) => {
      if (cancelled) return;
      const m = new Map<string, HTMLImageElement | null>();
      for (const r of results) m.set(r.url, r.img);
      setMap(m);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return map;
}
