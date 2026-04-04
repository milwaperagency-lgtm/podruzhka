/**
 * Варианты UI строго по `assetIds.ts` — только то, для чего есть файлы в `public/avatar-assets/`.
 */
import {
  CASUAL_BOTTOM_IDS,
  CASUAL_DRESS_IDS,
  CASUAL_JACKET_IDS,
  CASUAL_JEWELRY_IDS,
  CASUAL_SHOE_IDS,
  CASUAL_TOP_IDS,
  CASUAL_UNDERWEAR_IDS,
  HAIR_BANG_IDS,
  HAIR_SET_IDS,
  PART_DECOR_FACE_IDS,
  PART_EAR_IDS,
  PART_EYEBROW_IDS,
  PART_EYELASH_IDS,
  PART_EYE_WHITE_IDS,
  PART_MOUTH_IDS,
  PART_NOSE_IDS,
  PUPIL_IDS,
  SKIN_TONE_IDS,
} from '@/data/assetIds';

function labelMap(ids: readonly string[], labelFn: (id: string) => string): { id: string; label: string }[] {
  return ids.map((id) => ({ id, label: labelFn(id) }));
}

export const PART_EARS = PART_EAR_IDS.map((id) =>
  id === 'none'
    ? { id: 'none', label: 'Без ушей' }
    : { id, label: `Форма ушей · ${id}` }
);

export const PART_DECOR_FACE = PART_DECOR_FACE_IDS.map((id) =>
  id === 'none'
    ? { id: 'none', label: 'Без макияжа' }
    : { id, label: `Макияж / декор кожи · ${id}` }
);

export const PART_EYEBROWS = labelMap(PART_EYEBROW_IDS, (id) => `Брови · вариант ${id}`);
export const PART_EYELASHES = labelMap(PART_EYELASH_IDS, (id) => `Ресницы · ${id}`);
export const PART_EYE_WHITE = labelMap(PART_EYE_WHITE_IDS, (id) => `Склера / форма глаза · ${id}`);

export const PART_PUPILS = PUPIL_IDS.map((id) => ({
  id,
  label: `Радужка · ${id}`,
}));

export const PART_NOSE = labelMap(PART_NOSE_IDS, (id) => `Нос · ${id}`);
export const PART_MOUTH = labelMap(PART_MOUTH_IDS, (id) => `Губы · ${id}`);

export const SKIN_TONES = SKIN_TONE_IDS.map((id) => {
  const labels: Record<(typeof SKIN_TONE_IDS)[number], string> = {
    light: 'Светлая кожа',
    medium: 'Средняя кожа',
    deep: 'Тёмная кожа',
  };
  return { id, label: labels[id] };
});

export const HAIR_SETS = labelMap(HAIR_SET_IDS, (id) => `Причёска сзади · ${id}`);

export const HAIR_TONES = [
  { id: 'a' as const, label: 'Пряди сзади — оттенок A' },
  { id: 'b' as const, label: 'Пряди сзади — оттенок B' },
];

export const HAIR_BANGS_OPTS = labelMap(HAIR_BANG_IDS, (id) => `Чёлка · ${id}`);

export const CASUAL_TOPS = labelMap(CASUAL_TOP_IDS, (id) => `Верх одежды · ${id}`);
export const CASUAL_BOTTOMS = labelMap(CASUAL_BOTTOM_IDS, (id) => `Низ (юбка/брюки) · ${id}`);
export const CASUAL_DRESSES = labelMap(CASUAL_DRESS_IDS, (id) => `Платье · ${id}`);

export const CASUAL_JACKETS = CASUAL_JACKET_IDS.map((id) =>
  id === 'none'
    ? { id: 'none', label: 'Без жакета' }
    : { id, label: `Жакет / накидка · ${id}` }
);

export const CASUAL_SHOES = labelMap(CASUAL_SHOE_IDS, (id) => `Обувь · ${id}`);
export const CASUAL_UNDERWEAR = labelMap(CASUAL_UNDERWEAR_IDS, (id) => `Нижнее бельё · ${id}`);

export const CASUAL_JEWELRY = CASUAL_JEWELRY_IDS.map((id) =>
  id === 'none'
    ? { id: 'none', label: 'Без украшений' }
    : { id, label: `Украшение · ${id}` }
);

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
