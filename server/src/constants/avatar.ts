export interface AvatarState {
  faceShape: string;
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  lashes: string;
  lipstick: string;
  eyeshadow: string;
  blush: string;
  highlighter: string;
  outfitMode: 'top' | 'dress';
  top: string;
  dress: string;
  jacket: string;
  shoes: string;
  earrings: string;
  bag: string;
}

export const DEFAULT_AVATAR: AvatarState = {
  faceShape: 'oval',
  skinTone: 'medium',
  hairStyle: 'long_wavy',
  hairColor: 'chestnut',
  eyeColor: 'brown',
  lashes: 'natural',
  lipstick: 'none',
  eyeshadow: 'none',
  blush: 'none',
  highlighter: 'none',
  outfitMode: 'top',
  top: 'tee_white',
  dress: 'none',
  jacket: 'none',
  shoes: 'sneakers_white',
  earrings: 'none',
  bag: 'none',
};

export function diffCount(a: AvatarState, b: AvatarState): number {
  const keys = Object.keys(a) as (keyof AvatarState)[];
  let n = 0;
  for (const k of keys) {
    if (a[k] !== b[k]) n++;
  }
  return n;
}

export function hasAnyMakeup(s: AvatarState): boolean {
  return (
    s.lipstick !== 'none' ||
    s.eyeshadow !== 'none' ||
    s.blush !== 'none' ||
    s.highlighter !== 'none'
  );
}
