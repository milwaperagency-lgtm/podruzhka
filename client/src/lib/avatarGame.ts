/**
 * Должно совпадать с server/src/constants/avatar.ts (проверки уровней).
 */
import type { AvatarState } from '@/types';
import { defaultAvatarState } from '@/types';

export const DEFAULT_AVATAR: AvatarState = defaultAvatarState();

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
