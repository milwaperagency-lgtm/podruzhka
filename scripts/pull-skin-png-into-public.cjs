/**
 * Одноразово кладёт PNG баз кожи из стандартного кэша генерации Cursor → public/avatar-assets/skin/
 */
const fs = require('fs');
const path = require('path');

const SRC =
  process.env.SKIN_PNG_SRC ||
  path.join(process.env.USERPROFILE || '', '.cursor', 'projects', 'c-Users-PC-Desktop', 'assets');
const DST = path.join(__dirname, '..', 'client', 'public', 'avatar-assets', 'skin');
const NAMES = ['base_light.png', 'base_medium.png', 'base_deep.png'];

function main() {
  if (!fs.existsSync(SRC)) {
    console.error('Нет папки:', SRC);
    process.exitCode = 1;
    return;
  }
  fs.mkdirSync(DST, { recursive: true });
  for (const n of NAMES) {
    const from = path.join(SRC, n);
    const to = path.join(DST, n);
    if (!fs.existsSync(from)) {
      console.error('Нет файла:', from);
      process.exitCode = 1;
      return;
    }
    fs.copyFileSync(from, to);
    console.log('OK', to);
  }
}

main();
