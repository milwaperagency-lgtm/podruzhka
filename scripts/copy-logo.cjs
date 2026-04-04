/** Копирует podruzhka-logo.png из кэша Cursor → client/public/ */
const fs = require('fs');
const path = require('path');

const NAME = 'podruzhka-logo.png';
const SRC = path.join(
  process.env.USERPROFILE || '',
  '.cursor',
  'projects',
  'c-Users-PC-Desktop',
  'assets',
  NAME
);
const DST = path.join(__dirname, '..', 'client', 'public', NAME);

function main() {
  if (!fs.existsSync(SRC)) {
    console.warn('Логотип PNG не найден (будет SVG из public):', SRC);
    return;
  }
  fs.mkdirSync(path.dirname(DST), { recursive: true });
  fs.copyFileSync(SRC, DST);
  console.log('OK', DST);
}

main();
