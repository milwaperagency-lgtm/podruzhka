/**
 * Ищет base_light|medium|deep.png (сгенерированные в Cursor) и копирует в client/public/avatar-assets/skin/
 * Не падает, если файлов нет — тогда в игре остаются base_*.svg из репозитория.
 *
 * npm run copy:skin-png
 * SKIN_PNG_SRC=C:\\путь\\к\\папке — дополнительный источник
 */
const fs = require('fs');
const path = require('path');

const DST = path.join(__dirname, '..', 'client', 'public', 'avatar-assets', 'skin');
const NAMES = ['base_light.png', 'base_medium.png', 'base_deep.png'];

const CANDIDATES = [
  process.env.SKIN_PNG_SRC,
  path.join(process.env.USERPROFILE || '', '.cursor', 'projects', 'c-Users-PC-Desktop', 'assets'),
  path.join(process.env.USERPROFILE || '', '.cursor', 'projects', 'c-Users-PC-Desktop', 'assets', 'skin'),
].filter(Boolean);

function main() {
  fs.mkdirSync(DST, { recursive: true });
  let copied = 0;
  for (const dir of CANDIDATES) {
    if (!dir || !fs.existsSync(dir)) continue;
    for (const name of NAMES) {
      const src = path.join(dir, name);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(DST, name));
        console.log('OK', name, '←', src);
        copied++;
      }
    }
    if (copied >= 3) break;
  }
  if (copied === 0) {
    console.warn('[copy-skin-png] PNG не найдены — используйте base_*.svg или положите три PNG в папку и повторите.');
  } else {
    console.log('[copy-skin-png] Скопировано', copied, '→', DST);
    console.log('[copy-skin-png] Для сборки с PNG: в client/.env задайте VITE_SKIN_EXT=png');
  }
}

main();
