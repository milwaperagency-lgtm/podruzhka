/**
 * Опции редактора: части лица — файлы в `avatar-assets/parts/`,
 * одежда/волосы — в `avatar-assets/generated/` (если скопированы).
 */

function nOpts(n: number, prefix: string): { id: string; label: string }[] {
  return Array.from({ length: n }, (_, i) => ({
    id: String(i + 1),
    label: `${prefix} ${i + 1}`,
  }));
}

const PUPIL_IDS = [
  '1a',
  '1b',
  '1c',
  '2a',
  '2b',
  '2c',
  '3a',
  '3b',
  '3c',
  '4a',
  '4b',
  '4c',
  '5a',
  '5b',
  '5c',
] as const;

export const PART_EARS = [{ id: 'none', label: 'Нет' }, ...nOpts(8, 'Уши')];

export const PART_DECOR_FACE = [{ id: 'none', label: 'Нет' }, ...nOpts(21, 'Декор')];

export const PART_EYEBROWS = nOpts(10, 'Брови');

export const PART_EYELASHES = nOpts(7, 'Ресницы');

export const PART_EYE_WHITE = nOpts(4, 'Форма глаза');

export const PART_PUPILS = PUPIL_IDS.map((id) => ({ id, label: `Зрачок ${id}` }));

export const PART_NOSE = nOpts(6, 'Нос');

export const PART_MOUTH = nOpts(14, 'Губы');

export const SKIN_TONES = [
  { id: 'porcelain', label: 'Светлый' },
  { id: 'light', label: 'Светло-бежевый' },
  { id: 'medium', label: 'Средний' },
  { id: 'tan', label: 'Загар' },
  { id: 'deep', label: 'Глубокий' },
];

export const HAIR_STYLES = [
  { id: 'bob', label: 'Каре' },
  { id: 'long_wavy', label: 'Длинные волны' },
  { id: 'long_straight', label: 'Длинные прямые' },
  { id: 'pony', label: 'Хвост' },
];

export const HAIR_COLORS = [
  { id: 'black', label: 'Чёрный' },
  { id: 'chestnut', label: 'Каштан' },
  { id: 'blonde', label: 'Блонд' },
  { id: 'copper', label: 'Медь' },
  { id: 'pink', label: 'Розовый' },
  { id: 'lilac', label: 'Лиловый' },
];

export const TOPS = [
  { id: 'tee_white', label: 'Футболка белая' },
  { id: 'tee_blush', label: 'Футболка пудра' },
  { id: 'blouse_silk', label: 'Шёлковая блуза' },
  { id: 'hoodie', label: 'Худи' },
  { id: 'crop_top', label: 'Кроп-топ' },
];

export const DRESSES = [
  { id: 'none', label: 'Нет' },
  { id: 'midi_floral', label: 'Миди цветы' },
  { id: 'cocktail', label: 'Коктейльное' },
  { id: 'slip', label: 'Комбинация' },
];

export const JACKETS = [
  { id: 'none', label: 'Нет' },
  { id: 'denim', label: 'Джинсовка' },
];

export const SHOES = [
  { id: 'sneakers_white', label: 'Кроссовки' },
  { id: 'sneakers_pastel', label: 'Кроссовки пастель' },
  { id: 'heels_black', label: 'Каблуки чёрные' },
  { id: 'heels_nude', label: 'Каблуки нюд' },
  { id: 'boots', label: 'Ботинки' },
];

export const EARRINGS = [
  { id: 'none', label: 'Нет' },
  { id: 'studs', label: 'Пусеты' },
  { id: 'hoops', label: 'Кольца' },
  { id: 'drops', label: 'Подвески' },
];

export const BAGS = [
  { id: 'none', label: 'Нет' },
  { id: 'crossbody', label: 'Сумка' },
];

export function countActiveCustomizations(
  a: import('@/types').AvatarState,
  baseline: import('@/types').AvatarState
): number {
  const keys = Object.keys(a) as (keyof import('@/types').AvatarState)[];
  let n = 0;
  for (const k of keys) {
    if (a[k] !== baseline[k]) n++;
  }
  return n;
}
