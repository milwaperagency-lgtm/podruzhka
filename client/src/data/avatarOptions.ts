/**
 * Части лица — `avatar-assets/parts/`; тело — WebP в `avatar-assets/casual/`
 * (набор feminine casual, см. copy-feminine-casual-outfits.cjs).
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

/** Зад волос 1–10 × вариант a/b (файлы 1a.webp … 10b.webp). */
export const HAIR_SETS = nOpts(10, 'Волосы (сет)');

export const HAIR_TONES = [
  { id: 'a' as const, label: 'Вариант A' },
  { id: 'b' as const, label: 'Вариант B' },
];

export const HAIR_BANGS_OPTS = nOpts(10, 'Чёлка');

export const CASUAL_TOPS = nOpts(13, 'Верх');
export const CASUAL_BOTTOMS = nOpts(7, 'Низ');
export const CASUAL_DRESSES = nOpts(10, 'Платье');
export const CASUAL_JACKETS = [{ id: 'none', label: 'Нет' }, ...nOpts(10, 'Жакет')];
export const CASUAL_SHOES = nOpts(10, 'Обувь');
export const CASUAL_UNDERWEAR = nOpts(10, 'Бельё');
export const CASUAL_JEWELRY = [{ id: 'none', label: 'Нет' }, ...nOpts(10, 'Украшение')];

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
