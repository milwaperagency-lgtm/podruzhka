/**
 * Копирует базы лица (тон × форма) в client/public/avatar-assets/bases/
 * Имена: skin_{light|medium|deep}_{oval|round|heart}.png
 * node scripts/copy-skin-bases.cjs
 */
const fs = require('fs');
const path = require('path');

const FILES = [
  'skin_light_oval.png',
  'skin_light_round.png',
  'skin_light_heart.png',
  'skin_medium_oval.png',
  'skin_medium_round.png',
  'skin_medium_heart.png',
  'skin_deep_oval.png',
  'skin_deep_round.png',
  'skin_deep_heart.png',
];

const SRC = path.join(
  process.env.USERPROFILE || '',
  '.cursor',
  'projects',
  'c-Users-PC-Desktop',
  'assets'
);
const DST = path.join(__dirname, '..', 'client', 'public', 'avatar-assets', 'bases');

function main() {
  fs.mkdirSync(DST, { recursive: true });
  let n = 0;
  for (const f of FILES) {
    const s = path.join(SRC, f);
    const d = path.join(DST, f);
    if (!fs.existsSync(s)) {
      console.warn('Пропуск (нет файла):', f);
      continue;
    }
    fs.copyFileSync(s, d);
    n++;
    console.log('OK', f);
  }
  console.log('Скопировано:', n, '/', FILES.length, '→', DST);
}

main();
