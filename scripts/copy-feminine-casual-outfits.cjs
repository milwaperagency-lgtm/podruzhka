/**
 * Копирует набор «feminine casual outfits» (WebP) → client/public/avatar-assets/casual/
 *
 * Источник по умолчанию: Downloads/feminine casual outfits/feminine casual outfits
 * Или: FEMININE_OUTFITS_SRC = полный путь к папке, где лежат top/, bottom/, dress/, …
 */
const fs = require('fs');
const path = require('path');

const DOWNLOADS = path.join(process.env.USERPROFILE || '', 'Downloads');
const CANDIDATES = [
  process.env.FEMININE_OUTFITS_SRC,
  path.join(DOWNLOADS, 'feminine casual outfits', 'feminine casual outfits'),
  path.join(DOWNLOADS, 'feminine casual outfits'),
].filter(Boolean);

const DST = path.join(__dirname, '..', 'client', 'public', 'avatar-assets', 'casual');

function findSrc() {
  for (const p of CANDIDATES) {
    if (fs.existsSync(path.join(p, 'top'))) return p;
  }
  return null;
}

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function copyFlatDir(srcDir, dstSub) {
  if (!fs.existsSync(srcDir)) return 0;
  let n = 0;
  for (const f of fs.readdirSync(srcDir)) {
    if (!f.toLowerCase().endsWith('.webp')) continue;
    const from = path.join(srcDir, f);
    if (!fs.statSync(from).isFile()) continue;
    copyFile(from, path.join(DST, dstSub, f));
    console.log('OK', dstSub + '/' + f);
    n++;
  }
  return n;
}

/** hair (back)/1a.webp → hair_back/1a.webp */
function copyHairBack(srcRoot) {
  const names = ['hair (back)', 'hair_back', 'hair (back)'];
  let dir = null;
  for (const n of names) {
    const p = path.join(srcRoot, n);
    if (fs.existsSync(p)) {
      dir = p;
      break;
    }
  }
  if (!dir) return 0;
  return copyFlatDir(dir, 'hair_back');
}

function copyHairBangs(srcRoot) {
  const names = ['hair (bangs)', 'hair_bangs', 'hair (bangs)'];
  for (const n of names) {
    const p = path.join(srcRoot, n);
    if (fs.existsSync(p)) return copyFlatDir(p, 'hair_bangs');
  }
  return 0;
}

/** underwear: top1/bottom1 … → underwear/1.webp … (по алфавиту имён) */
function copyUnderwearRenumbered(srcRoot) {
  const dir = path.join(srcRoot, 'underwear');
  if (!fs.existsSync(dir)) return 0;
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.webp'))
    .sort((a, b) => a.localeCompare(b, 'en'));
  let n = 0;
  files.forEach((f, i) => {
    const num = String(i + 1);
    copyFile(path.join(dir, f), path.join(DST, 'underwear', num + '.webp'));
    console.log('OK underwear/' + num + '.webp ←', f);
    n++;
  });
  return n;
}

/** jewelery → jewelry/1.webp … по алфавиту имён файлов */
function copyJewelryRenumbered(srcRoot) {
  const names = ['jewelery', 'jewelry', 'jewellery'];
  let dir = null;
  for (const n of names) {
    const p = path.join(srcRoot, n);
    if (fs.existsSync(p)) {
      dir = p;
      break;
    }
  }
  if (!dir) return 0;
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.webp'))
    .sort((a, b) => a.localeCompare(b, 'en'));
  let n = 0;
  files.forEach((f, i) => {
    const num = String(i + 1);
    copyFile(path.join(dir, f), path.join(DST, 'jewelry', num + '.webp'));
    console.log('OK jewelry/' + num + '.webp ←', f);
    n++;
  });
  return n;
}

function main() {
  const SRC = findSrc();
  if (!SRC) {
    console.warn('Не найдена папка набора (нужны подпапки top/, …). Задайте FEMININE_OUTFITS_SRC.');
    return;
  }
  console.log('SRC =', SRC);
  fs.mkdirSync(DST, { recursive: true });

  let total = 0;
  total += copyFlatDir(path.join(SRC, 'bottom'), 'bottom');
  total += copyFlatDir(path.join(SRC, 'dress'), 'dress');
  total += copyFlatDir(path.join(SRC, 'jacket'), 'jacket');
  total += copyFlatDir(path.join(SRC, 'shoes'), 'shoes');
  total += copyFlatDir(path.join(SRC, 'top'), 'top');
  total += copyUnderwearRenumbered(SRC);
  total += copyHairBack(SRC);
  total += copyHairBangs(SRC);
  total += copyJewelryRenumbered(SRC);

  console.log('Файлов:', total, '→', DST);
}

main();
