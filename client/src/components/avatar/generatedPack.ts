import type { AvatarState } from '@/types';

const BASE = '/avatar-assets/generated';

/** Пути к сгенерированным PNG (1024×1024, контент по центру). */
export const GENERATED = {
  eyes: {
    brown: `${BASE}/eyes_brown.png`,
    blue: `${BASE}/eyes_blue.png`,
    green: `${BASE}/eyes_green.png`,
  },
  lips: {
    nude: `${BASE}/lips_nude.png`,
    rose: `${BASE}/lips_pink.png`,
    berry: `${BASE}/lips_red.png`,
    red: `${BASE}/lips_red.png`,
    coral: `${BASE}/lips_pink.png`,
  },
  hair: {
    long: `${BASE}/hair_long.png`,
    bob: `${BASE}/hair_bob.png`,
    pony: `${BASE}/hair_pony.png`,
  },
  haircolor: {
    blonde: `${BASE}/haircolor_blonde.png`,
    chestnut: `${BASE}/haircolor_brown.png`,
    copper: `${BASE}/haircolor_brown.png`,
    black: `${BASE}/haircolor_black.png`,
    pink: `${BASE}/haircolor_blonde.png`,
    lilac: `${BASE}/haircolor_blonde.png`,
  },
  outfit: {
    hoodie: `${BASE}/outfit_hoodie.png`,
    dress: `${BASE}/outfit_dress.png`,
    top: `${BASE}/outfit_top.png`,
  },
  makeup: {
    blush: `${BASE}/makeup_blush.png`,
    eyeliner: `${BASE}/makeup_eyeliner.png`,
    highlighter: `${BASE}/makeup_highlighter.png`,
  },
  shoes: {
    sneakers_white: `${BASE}/shoes_sneakers.png`,
    sneakers_pastel: `${BASE}/shoes_sneakers.png`,
    heels_black: `${BASE}/shoes_heels.png`,
    heels_nude: `${BASE}/shoes_heels.png`,
    boots: `${BASE}/shoes_boots.png`,
  },
  earrings: {
    studs: `${BASE}/earrings_studs.png`,
    hoops: `${BASE}/earrings_hoops.png`,
    drops: `${BASE}/earrings_drops.png`,
  },
  brows: {
    natural: `${BASE}/brows_natural.png`,
    arched: `${BASE}/brows_arched.png`,
    soft: `${BASE}/brows_soft.png`,
  },
  jacket: {
    denim: `${BASE}/jacket_denim.png`,
  },
  bag: `${BASE}/bag_pink.png`,
  bow: `${BASE}/accessory_bow.png`,
} as const;

/** Раскладка на холсте 320×420 (масштаб от 1024). */
export const L = {
  hair: { x: 28, y: 28, w: 264, h: 340 },
  outfit: { x: 24, y: 188, w: 272, h: 220 },
  shoes: { x: 44, y: 358, w: 232, h: 56 },
  eyes: { x: 88, y: 128, w: 144, h: 72 },
  lips: { x: 112, y: 178, w: 96, h: 48 },
  makeupBlush: { x: 48, y: 138, w: 224, h: 120 },
  makeupLiner: { x: 56, y: 120, w: 208, h: 90 },
  makeupHi: { x: 52, y: 128, w: 216, h: 140 },
  brows: { x: 72, y: 108, w: 176, h: 40 },
  earrings: { x: 0, y: 0, w: 320, h: 420 },
  jacket: { x: 20, y: 168, w: 280, h: 240 },
  bag: { x: 188, y: 248, w: 120, h: 140 },
  bow: { x: 96, y: 18, w: 128, h: 72 },
};

export function eyeSrc(state: AvatarState): string {
  return GENERATED.eyes[state.eyeColor as keyof typeof GENERATED.eyes] ?? GENERATED.eyes.brown;
}

export function lipSrc(state: AvatarState): string | null {
  if (state.lipstick === 'none') return null;
  const k = state.lipstick as keyof typeof GENERATED.lips;
  return GENERATED.lips[k] ?? GENERATED.lips.nude;
}

export function hairSrc(state: AvatarState): string | null {
  const { hairStyle, hairColor } = state;
  if (hairStyle === 'bob') {
    const c = hairColor as keyof typeof GENERATED.haircolor;
    return GENERATED.haircolor[c] ?? GENERATED.haircolor.blonde;
  }
  if (hairStyle === 'pony') return GENERATED.hair.pony;
  if (hairStyle === 'long_straight' || hairStyle === 'long_wavy') return GENERATED.hair.long;
  if (hairStyle === 'pixie' || hairStyle === 'bun') return GENERATED.hair.bob;
  return GENERATED.hair.long;
}

export function outfitSrc(state: AvatarState): string | null {
  if (state.outfitMode === 'dress' && state.dress !== 'none') return GENERATED.outfit.dress;
  if (state.top === 'hoodie') return GENERATED.outfit.hoodie;
  return GENERATED.outfit.top;
}

export function shoeSrc(state: AvatarState): string {
  const s = state.shoes as keyof typeof GENERATED.shoes;
  return GENERATED.shoes[s] ?? GENERATED.shoes.sneakers_white;
}

export function jacketOverlaySrc(state: AvatarState): string | null {
  if (state.jacket === 'denim') return GENERATED.jacket.denim;
  return null;
}

export function earringSrc(state: AvatarState): string | null {
  if (state.earrings === 'none') return null;
  return GENERATED.earrings[state.earrings as keyof typeof GENERATED.earrings] ?? null;
}

export function makeupSrc(kind: 'blush' | 'eyeshadow' | 'highlighter', state: AvatarState): string | null {
  if (kind === 'blush' && state.blush !== 'none') return GENERATED.makeup.blush;
  if (kind === 'eyeshadow' && state.eyeshadow !== 'none') return GENERATED.makeup.eyeliner;
  if (kind === 'highlighter' && state.highlighter !== 'none') return GENERATED.makeup.highlighter;
  return null;
}

/** Брови привязаны к тону кожи — условно */
export function browSrc(state: AvatarState): string {
  if (state.skinTone === 'deep' || state.skinTone === 'tan') return GENERATED.brows.arched;
  if (state.skinTone === 'porcelain' || state.skinTone === 'light') return GENERATED.brows.soft;
  return GENERATED.brows.natural;
}
