/**
 * Единственный источник растров: папка набора ассетов (по умолчанию %USERPROFILE%\\Downloads\\assets\\assets).
 * Задайте ASSETS_BUNDLE для другого пути.
 *
 * Копирует:
 *   — части лица → client/public/avatar-assets/parts/  (как раньше copy-face-parts; «decor face» → decor_face)
 *   — тело / одежда / волосы → client/public/avatar-assets/body/  из подпапки body/ или generated/ внутри набора
 *   — podruzhka-logo.png → client/public/  (если есть в корне набора)
 *
 * Не использует кэш Cursor и прочие внешние пути.
 */
const fs = require('fs');
const path = require('path');

const BUNDLE =
  process.env.ASSETS_BUNDLE ||
  process.env.FACE_PARTS_SRC ||
  path.join(process.env.USERPROFILE || '', 'Downloads', 'assets', 'assets');

const PUBLIC = path.join(__dirname, '..', 'client', 'public');
const DST_PARTS = path.join(PUBLIC, 'avatar-assets', 'parts');
const DST_BODY = path.join(PUBLIC, 'avatar-assets', 'body');

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function copyFaceParts() {
  if (!fs.existsSync(BUNDLE)) {
    console.warn('Пропуск: нет папки набора ассетов:', BUNDLE);
    return;
  }

  const baseWhite = path.join(BUNDLE, 'base_white_eyes.png');
  if (fs.existsSync(baseWhite)) {
    copyFile(baseWhite, path.join(DST_PARTS, 'base_white_eyes.png'));
    console.log('OK parts/base_white_eyes.png');
  }

  const dirs = [
    ['ears', 'ears'],
    ['eyebrows', 'eyebrows'],
    ['eyelashes', 'eyelashes'],
    ['eyes', 'eyes'],
    ['mouth', 'mouth'],
    ['nose', 'nose'],
    ['pupils', 'pupils'],
  ];

  for (const [srcName, dstName] of dirs) {
    const srcDir = path.join(BUNDLE, srcName);
    if (!fs.existsSync(srcDir)) continue;
    for (const f of fs.readdirSync(srcDir)) {
      if (!f.endsWith('.png')) continue;
      copyFile(path.join(srcDir, f), path.join(DST_PARTS, dstName, f));
      console.log('OK parts/' + dstName + '/' + f);
    }
  }

  const decorSrc = path.join(BUNDLE, 'decor face');
  const decorDst = path.join(DST_PARTS, 'decor_face');
  if (fs.existsSync(decorSrc)) {
    for (const f of fs.readdirSync(decorSrc)) {
      if (!f.endsWith('.png')) continue;
      copyFile(path.join(decorSrc, f), path.join(decorDst, f));
      console.log('OK parts/decor_face/' + f);
    }
  }
}

/** PNG из подпапки набора (только корень подпапки — имена как hair_bob_black.png). */
function copyBodyFlat() {
  const sub = ['body', 'generated'].map((name) => path.join(BUNDLE, name)).find((p) => fs.existsSync(p));
  if (!sub) {
    console.warn('Нет подпапки body/ или generated/ в наборе — слои одежды/волос не скопированы.');
    return;
  }
  fs.mkdirSync(DST_BODY, { recursive: true });
  let n = 0;
  for (const f of fs.readdirSync(sub)) {
    if (!f.endsWith('.png')) continue;
    const from = path.join(sub, f);
    if (!fs.statSync(from).isFile()) continue;
    copyFile(from, path.join(DST_BODY, f));
    console.log('OK body/' + f);
    n++;
  }
  if (n === 0) console.warn('В', sub, 'не найдено PNG в корне.');
}

function copyLogo() {
  const name = 'podruzhka-logo.png';
  const src = path.join(BUNDLE, name);
  if (!fs.existsSync(src)) {
    console.warn('Логотип PNG не в наборе (оставляем SVG в public):', src);
    return;
  }
  copyFile(src, path.join(PUBLIC, name));
  console.log('OK public/' + name);
}

function main() {
  console.log('ASSETS_BUNDLE =', BUNDLE);
  copyFaceParts();
  copyBodyFlat();
  copyLogo();
  console.log('→ parts:', DST_PARTS);
  console.log('→ body:', DST_BODY);
}

main();
