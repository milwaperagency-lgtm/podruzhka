/**
 * Копирует PNG из кэша Cursor → client/public/avatar-assets/generated/
 * Запуск из корня: npm run copy:generated-assets
 */
const fs = require('fs');
const path = require('path');

const FILES = [
  // Глаза eyes_{shape}_{color}
  'eyes_almond_brown.png',
  'eyes_almond_blue.png',
  'eyes_almond_green.png',
  'eyes_round_brown.png',
  'eyes_round_blue.png',
  'eyes_round_green.png',
  'eyes_wide_brown.png',
  'eyes_wide_blue.png',
  'eyes_wide_green.png',
  // Губы lips_{id}
  'lips_nude.png',
  'lips_rose.png',
  'lips_berry.png',
  'lips_red.png',
  'lips_coral.png',
  // Волосы hair_{bob|pony|long}_{color}
  'hair_bob_black.png',
  'hair_bob_chestnut.png',
  'hair_bob_blonde.png',
  'hair_bob_copper.png',
  'hair_bob_pink.png',
  'hair_bob_lilac.png',
  'hair_pony_black.png',
  'hair_pony_chestnut.png',
  'hair_pony_blonde.png',
  'hair_pony_copper.png',
  'hair_pony_pink.png',
  'hair_pony_lilac.png',
  'hair_long_black.png',
  'hair_long_chestnut.png',
  'hair_long_blonde.png',
  'hair_long_copper.png',
  'hair_long_pink.png',
  'hair_long_lilac.png',
  'lashes_natural.png',
  'lashes_long.png',
  'lashes_volume.png',
  'blush_peach.png',
  'blush_rose.png',
  'blush_berry.png',
  'eyeshadow_nude_smoke.png',
  'eyeshadow_rose_gold.png',
  'eyeshadow_mauve.png',
  'eyeshadow_smoky.png',
  'highlighter_pearl.png',
  'highlighter_gold.png',
  'highlighter_pink_glow.png',
  'top_tee_white.png',
  'top_tee_blush.png',
  'top_blouse_silk.png',
  'top_hoodie.png',
  'top_crop_top.png',
  'dress_midi_floral.png',
  'dress_cocktail.png',
  'dress_slip.png',
  'shoes_sneakers_white.png',
  'shoes_sneakers_pastel.png',
  'shoes_heels_black.png',
  'shoes_heels_nude.png',
  'shoes_boots.png',
  'earrings_studs.png',
  'earrings_hoops.png',
  'earrings_drops.png',
  'jacket_denim.png',
  'bag_crossbody.png',
  'brows_natural.png',
  'brows_arched.png',
  'brows_soft.png',
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
