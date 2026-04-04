import type { AvatarState } from '@/types';
import { publicUrl } from '@/lib/publicUrl';

const BASE = () => publicUrl('avatar-assets/generated');
const BASES = () => publicUrl('avatar-assets/bases');

function skinToneKey(t: string): 'light' | 'medium' | 'deep' {
  if (t === 'porcelain' || t === 'light') return 'light';
  if (t === 'medium' || t === 'tan') return 'medium';
  return 'deep';
}

function faceShapeKey(s: string): 'oval' | 'round' | 'heart' {
  if (s === 'round' || s === 'heart') return s;
  return 'oval';
}

function hairStyleKey(s: string): 'bob' | 'pony' | 'long' {
  if (s === 'bob') return 'bob';
  if (s === 'pony') return 'pony';
  return 'long';
}

const HAIR_COLORS = ['black', 'chestnut', 'blonde', 'copper', 'pink', 'lilac'] as const;
function hairColorKey(c: string): (typeof HAIR_COLORS)[number] {
  return (HAIR_COLORS as readonly string[]).includes(c) ? (c as (typeof HAIR_COLORS)[number]) : 'chestnut';
}

function eyeShapeKey(s: string): 'almond' | 'round' | 'wide' {
  if (s === 'round' || s === 'wide') return s;
  return 'almond';
}

const EYE_COLORS = ['brown', 'blue', 'green'] as const;
function eyeColorKey(c: string): (typeof EYE_COLORS)[number] {
  return (EYE_COLORS as readonly string[]).includes(c) ? (c as (typeof EYE_COLORS)[number]) : 'brown';
}

/** Базы лица (тон × форма). */
export const SKIN_BASE = {
  light: {
    oval: () => `${BASES()}/skin_light_oval.png`,
    round: () => `${BASES()}/skin_light_round.png`,
    heart: () => `${BASES()}/skin_light_heart.png`,
  },
  medium: {
    oval: () => `${BASES()}/skin_medium_oval.png`,
    round: () => `${BASES()}/skin_medium_round.png`,
    heart: () => `${BASES()}/skin_medium_heart.png`,
  },
  deep: {
    oval: () => `${BASES()}/skin_deep_oval.png`,
    round: () => `${BASES()}/skin_deep_round.png`,
    heart: () => `${BASES()}/skin_deep_heart.png`,
  },
} as const;

/** Раскладка на холсте 320×420 (единый масштаб от 1024). */
export const L = {
  skinBase: { x: 18, y: 44, w: 284, h: 304 },
  hair: { x: 26, y: 26, w: 268, h: 338 },
  outfit: { x: 22, y: 198, w: 276, h: 210 },
  shoes: { x: 44, y: 358, w: 232, h: 56 },
  eyes: { x: 86, y: 130, w: 148, h: 74 },
  lips: { x: 108, y: 186, w: 104, h: 52 },
  lashes: { x: 86, y: 128, w: 148, h: 78 },
  makeupBlush: { x: 46, y: 140, w: 228, h: 122 },
  makeupLiner: { x: 54, y: 122, w: 212, h: 92 },
  makeupHi: { x: 50, y: 130, w: 220, h: 142 },
  brows: { x: 70, y: 108, w: 180, h: 42 },
  earrings: { x: 0, y: 0, w: 320, h: 420 },
  jacket: { x: 20, y: 168, w: 280, h: 240 },
  bag: { x: 188, y: 248, w: 120, h: 140 },
  bow: { x: 96, y: 18, w: 128, h: 72 },
};

/** Единая точка для сумки (один вариант в UI). */
export function bagSrc(): string {
  return `${BASE()}/bag_crossbody.png`;
}

export function skinBaseSrc(state: AvatarState): string {
  const tone = skinToneKey(state.skinTone);
  const shape = faceShapeKey(state.faceShape);
  return SKIN_BASE[tone][shape]();
}

export function eyeSrc(state: AvatarState): string {
  const sh = eyeShapeKey(state.eyeShape);
  const c = eyeColorKey(state.eyeColor);
  return `${BASE()}/eyes_${sh}_${c}.png`;
}

export function lipSrc(state: AvatarState): string | null {
  if (state.lipstick === 'none') return null;
  return `${BASE()}/lips_${state.lipstick}.png`;
}

export function hairSrc(state: AvatarState): string {
  const style = hairStyleKey(state.hairStyle);
  const color = hairColorKey(state.hairColor);
  return `${BASE()}/hair_${style}_${color}.png`;
}

export function lashSrc(state: AvatarState): string {
  return `${BASE()}/lashes_${state.lashes}.png`;
}

export function outfitSrc(state: AvatarState): string | null {
  if (state.outfitMode === 'dress' && state.dress !== 'none') {
    return `${BASE()}/dress_${state.dress}.png`;
  }
  if (state.outfitMode === 'top') {
    return `${BASE()}/top_${state.top}.png`;
  }
  return null;
}

export function shoeSrc(state: AvatarState): string {
  return `${BASE()}/shoes_${state.shoes}.png`;
}

export function jacketOverlaySrc(state: AvatarState): string | null {
  if (state.jacket === 'denim') return `${BASE()}/jacket_denim.png`;
  return null;
}

export function earringSrc(state: AvatarState): string | null {
  if (state.earrings === 'none') return null;
  return `${BASE()}/earrings_${state.earrings}.png`;
}

export function browSrc(state: AvatarState): string {
  if (state.skinTone === 'deep' || state.skinTone === 'tan') return `${BASE()}/brows_arched.png`;
  if (state.skinTone === 'porcelain' || state.skinTone === 'light') return `${BASE()}/brows_soft.png`;
  return `${BASE()}/brows_natural.png`;
}

export function blushSrc(state: AvatarState): string | null {
  if (state.blush === 'none') return null;
  return `${BASE()}/blush_${state.blush}.png`;
}

export function eyeshadowSrc(state: AvatarState): string | null {
  if (state.eyeshadow === 'none') return null;
  return `${BASE()}/eyeshadow_${state.eyeshadow}.png`;
}

export function highlighterSrc(state: AvatarState): string | null {
  if (state.highlighter === 'none') return null;
  return `${BASE()}/highlighter_${state.highlighter}.png`;
}

/** @deprecated используйте blushSrc / eyeshadowSrc / highlighterSrc */
export function makeupSrc(kind: 'blush' | 'eyeshadow' | 'highlighter', state: AvatarState): string | null {
  if (kind === 'blush') return blushSrc(state);
  if (kind === 'eyeshadow') return eyeshadowSrc(state);
  return highlighterSrc(state);
}
