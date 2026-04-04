/**
 * ID, для которых реально есть файлы в `public/avatar-assets/`.
 * При добавлении/удалении PNG/WebP обновите списки и подписи в `avatarOptions.ts`.
 */

export const SKIN_TONE_IDS = ['light', 'medium', 'deep'] as const;
export type SkinToneId = (typeof SKIN_TONE_IDS)[number];

const n = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

/** Уши: none или 1…8 */
export const PART_EAR_IDS = ['none', ...n(1, 8)] as const;

/** Декор лица: none или 1…21 */
export const PART_DECOR_FACE_IDS = ['none', ...n(1, 21)] as const;

export const PART_EYEBROW_IDS = n(1, 10);
export const PART_EYELASH_IDS = n(1, 7);
export const PART_EYE_WHITE_IDS = n(1, 4);
export const PART_NOSE_IDS = n(1, 6);
export const PART_MOUTH_IDS = n(1, 14);

export const PUPIL_IDS = [
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

export const HAIR_SET_IDS = n(1, 10);
export const HAIR_BANG_IDS = n(1, 10);

export const CASUAL_SHOE_IDS = n(1, 10);
export const CASUAL_UNDERWEAR_IDS = n(1, 10);
export const CASUAL_BOTTOM_IDS = n(1, 7);
export const CASUAL_TOP_IDS = n(1, 13);
export const CASUAL_DRESS_IDS = n(1, 10);
export const CASUAL_JACKET_IDS = ['none', ...n(1, 10)] as const;
export const CASUAL_JEWELRY_IDS = ['none', ...n(1, 10)] as const;

function includes<T extends string>(arr: readonly T[], v: string): v is T {
  return (arr as readonly string[]).includes(v);
}

export function pickSkinTone(raw: string): SkinToneId {
  if (includes(SKIN_TONE_IDS, raw)) return raw;
  if (raw === 'porcelain') return 'light';
  if (raw === 'tan') return 'deep';
  return 'light';
}

export function pickFrom<T extends string>(arr: readonly T[], v: string, fallback: T): T {
  return includes(arr, v) ? v : fallback;
}

export function pickPupil(v: string): (typeof PUPIL_IDS)[number] {
  return includes(PUPIL_IDS, v) ? v : '1a';
}
