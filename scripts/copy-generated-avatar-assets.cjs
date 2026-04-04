/**
 * Копирует сгенерированные PNG из кэша Cursor в client/public/avatar-assets/generated/
 * Запуск из корня: node scripts/copy-generated-avatar-assets.cjs
 */
const fs = require('fs');
const path = require('path');

const FILES = [
  'eyes_brown.png',
  'eyes_blue.png',
  'eyes_green.png',
  'lips_nude.png',
  'lips_pink.png',
  'lips_red.png',
  'hair_long.png',
  'hair_bob.png',
  'hair_pony.png',
  'haircolor_blonde.png',
  'haircolor_brown.png',
  'haircolor_black.png',
  'outfit_hoodie.png',
  'outfit_dress.png',
  'outfit_top.png',
  'makeup_blush.png',
  'makeup_eyeliner.png',
  'makeup_highlighter.png',
  'shoes_sneakers.png',
  'shoes_heels.png',
  'shoes_boots.png',
  'earrings_studs.png',
  'earrings_hoops.png',
  'earrings_drops.png',
  'brows_natural.png',
  'brows_arched.png',
  'brows_soft.png',
  'jacket_denim.png',
  'bag_pink.png',
  'accessory_bow.png',
];

const SRC = path.join(
  process.env.USERPROFILE || '',
  '.cursor',
  'projects',
  'c-Users-PC-Desktop',
  'assets'
);
const DST = path.join(__dirname, '..', 'client', 'public', 'avatar-assets', 'generated');

function main() {
  fs.mkdirSync(DST, { recursive: true });
  let n = 0;
  for (const f of FILES) {
    const s = path.join(SRC, f);
    const d = path.join(DST, f);
    if (!fs.existsSync(s)) {
      console.warn('Пропуск (нет файла):', s);
      continue;
    }
    fs.copyFileSync(s, d);
    n++;
    console.log('OK', f);
  }
  console.log('Скопировано:', n, '→', DST);
}

main();
