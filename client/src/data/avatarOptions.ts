/**
 * Части лица — `avatar-assets/parts/`; тело — `avatar-assets/casual/`; база кожи — `avatar-assets/bases/`.
 */

function nOpts(n: number, labelFn: (i: number) => string): { id: string; label: string }[] {
  return Array.from({ length: n }, (_, i) => ({
    id: String(i + 1),
    label: labelFn(i + 1),
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

export const PART_EARS = [
  { id: 'none', label: 'Без ушей' },
  ...nOpts(8, (i) => `Форма ушей · ${i}`),
];

export const PART_DECOR_FACE = [
  { id: 'none', label: 'Без макияжа' },
  ...nOpts(21, (i) => `Макияж / декор кожи · ${i}`),
];

export const PART_EYEBROWS = nOpts(10, (i) => `Брови · вариант ${i}`);

export const PART_EYELASHES = nOpts(7, (i) => `Ресницы · ${i}`);

export const PART_EYE_WHITE = nOpts(4, (i) => `Склера / форма глаза · ${i}`);

export const PART_PUPILS = PUPIL_IDS.map((id) => ({
  id,
  label: `Радужка · ${id}`,
}));

export const PART_NOSE = nOpts(6, (i) => `Нос · ${i}`);

export const PART_MOUTH = nOpts(14, (i) => `Губы · ${i}`);

/** Три PNG-базы кожи — `avatar-assets/bases/base_*.png` */
export const SKIN_TONES = [
  { id: 'light', label: 'Светлая кожа' },
  { id: 'medium', label: 'Средняя кожа' },
  { id: 'deep', label: 'Тёмная кожа' },
] as const;

export const HAIR_SETS = nOpts(10, (i) => `Причёска сзади · ${i}`);

export const HAIR_TONES = [
  { id: 'a' as const, label: 'Пряди сзади — оттенок A' },
  { id: 'b' as const, label: 'Пряди сзади — оттенок B' },
];

export const HAIR_BANGS_OPTS = nOpts(10, (i) => `Чёлка · ${i}`);

export const CASUAL_TOPS = nOpts(13, (i) => `Верх одежды · ${i}`);
export const CASUAL_BOTTOMS = nOpts(7, (i) => `Низ (юбка/брюки) · ${i}`);
export const CASUAL_DRESSES = nOpts(10, (i) => `Платье · ${i}`);
export const CASUAL_JACKETS = [
  { id: 'none', label: 'Без жакета' },
  ...nOpts(10, (i) => `Жакет / накидка · ${i}`),
];
export const CASUAL_SHOES = nOpts(10, (i) => `Обувь · ${i}`);
export const CASUAL_UNDERWEAR = nOpts(10, (i) => `Нижнее бельё · ${i}`);
export const CASUAL_JEWELRY = [
  { id: 'none', label: 'Без украшений' },
  ...nOpts(10, (i) => `Украшение · ${i}`),
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
