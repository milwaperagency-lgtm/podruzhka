export const FACE_SHAPES = [
  { id: 'oval', label: 'Овал' },
  { id: 'round', label: 'Круг' },
  { id: 'heart', label: 'Сердце' },
];

export const SKIN_TONES = [
  { id: 'porcelain', label: 'Светлый' },
  { id: 'light', label: 'Светло-бежевый' },
  { id: 'medium', label: 'Средний' },
  { id: 'tan', label: 'Загар' },
  { id: 'deep', label: 'Глубокий' },
];

export const HAIR_STYLES = [
  { id: 'pixie', label: 'Пикси' },
  { id: 'bob', label: 'Каре' },
  { id: 'long_wavy', label: 'Длинные волны' },
  { id: 'long_straight', label: 'Длинные прямые' },
  { id: 'pony', label: 'Хвост' },
  { id: 'bun', label: 'Пучок' },
];

export const HAIR_COLORS = [
  { id: 'black', label: 'Чёрный' },
  { id: 'chestnut', label: 'Каштан' },
  { id: 'blonde', label: 'Блонд' },
  { id: 'copper', label: 'Медь' },
  { id: 'pink', label: 'Розовый' },
  { id: 'lilac', label: 'Лиловый' },
];

export const EYE_COLORS = [
  { id: 'brown', label: 'Карий' },
  { id: 'green', label: 'Зелёный' },
  { id: 'blue', label: 'Голубой' },
  { id: 'hazel', label: 'Орех' },
  { id: 'grey', label: 'Серый' },
];

export const LASHES = [
  { id: 'natural', label: 'Естественные' },
  { id: 'long', label: 'Длинные' },
  { id: 'volume', label: 'Объём' },
];

export const LIPSTICKS = [
  { id: 'none', label: 'Нет' },
  { id: 'nude', label: 'Нюд' },
  { id: 'rose', label: 'Роза' },
  { id: 'berry', label: 'Ягода' },
  { id: 'red', label: 'Красный' },
  { id: 'coral', label: 'Коралл' },
];

export const EYESHADOWS = [
  { id: 'none', label: 'Нет' },
  { id: 'nude_smoke', label: 'Нюд' },
  { id: 'rose_gold', label: 'Розовое золото' },
  { id: 'mauve', label: 'Лиловый' },
  { id: 'smoky', label: 'Смоки' },
];

export const BLUSH = [
  { id: 'none', label: 'Нет' },
  { id: 'peach', label: 'Персик' },
  { id: 'rose', label: 'Роза' },
  { id: 'berry', label: 'Ягода' },
];

export const HIGHLIGHTER = [
  { id: 'none', label: 'Нет' },
  { id: 'pearl', label: 'Жемчуг' },
  { id: 'gold', label: 'Золото' },
  { id: 'pink_glow', label: 'Розовое сияние' },
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
  { id: 'blazer', label: 'Пиджак' },
  { id: 'denim', label: 'Джинсовка' },
  { id: 'cardigan', label: 'Кардиган' },
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
  { id: 'tote', label: 'Тоут' },
  { id: 'clutch', label: 'Клатч' },
  { id: 'crossbody', label: 'Кросс-боди' },
];

/** Count customization choices that differ from a baseline snapshot (for level 19) */
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
