export interface AvatarState {
  partEars: string;
  partDecorFace: string;
  partEyebrows: string;
  partEyelashes: string;
  partEyeWhite: string;
  partPupil: string;
  partNose: string;
  partMouth: string;
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  outfitMode: 'top' | 'dress';
  top: string;
  dress: string;
  jacket: string;
  shoes: string;
  earrings: string;
  bag: string;
}

export const DEFAULT_AVATAR: AvatarState = {
  partEars: 'none',
  partDecorFace: 'none',
  partEyebrows: '1',
  partEyelashes: '1',
  partEyeWhite: '1',
  partPupil: '1a',
  partNose: '1',
  partMouth: '1',
  skinTone: 'medium',
  hairStyle: 'long_wavy',
  hairColor: 'chestnut',
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
    s.partDecorFace !== 'none' ||
    s.partEyelashes !== '1' ||
    s.partMouth !== '1' ||
    s.partEyebrows !== '1'
  );
}

export function makeupLayerCount(s: AvatarState): number {
  let n = 0;
  if (s.partDecorFace !== 'none') n++;
  if (s.partEyelashes !== '1') n++;
  if (s.partEyebrows !== '1') n++;
  if (s.partMouth !== '1') n++;
  if (s.partPupil !== DEFAULT_AVATAR.partPupil) n++;
  if (s.partEyeWhite !== DEFAULT_AVATAR.partEyeWhite) n++;
  return n;
}
