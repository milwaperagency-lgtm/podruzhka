/**
 * Копирует модульные части лица из набора пользователя в client/public/avatar-assets/parts/
 *
 * Источник по умолчанию: %USERPROFILE%\Downloads\assets\assets
 * Папка "decor face" копируется как decor_face (без пробела).
 *
 * Запуск из корня проекта: npm run copy:face-parts
 */
const fs = require('fs');
const path = require('path');

const SRC_ROOT =
  process.env.FACE_PARTS_SRC ||
  path.join(process.env.USERPROFILE || '', 'Downloads', 'assets', 'assets');

const DST = path.join(__dirname, '..', 'client', 'public', 'avatar-assets', 'parts');

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function main() {
  if (!fs.existsSync(SRC_ROOT)) {
    console.warn('Пропуск: нет папки с частями лица:', SRC_ROOT);
    return;
  }

  const baseWhite = path.join(SRC_ROOT, 'base_white_eyes.png');
  if (fs.existsSync(baseWhite)) {
    copyFile(baseWhite, path.join(DST, 'base_white_eyes.png'));
    console.log('OK base_white_eyes.png');
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
    const srcDir = path.join(SRC_ROOT, srcName);
    if (!fs.existsSync(srcDir)) continue;
    for (const f of fs.readdirSync(srcDir)) {
      if (!f.endsWith('.png')) continue;
      copyFile(path.join(srcDir, f), path.join(DST, dstName, f));
      console.log('OK', dstName + '/' + f);
    }
  }

  const decorSrc = path.join(SRC_ROOT, 'decor face');
  const decorDst = path.join(DST, 'decor_face');
  if (fs.existsSync(decorSrc)) {
    for (const f of fs.readdirSync(decorSrc)) {
      if (!f.endsWith('.png')) continue;
      copyFile(path.join(decorSrc, f), path.join(decorDst, f));
      console.log('OK decor_face/' + f);
    }
  }

  console.log('→', DST);
}

main();
