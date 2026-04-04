import type { AvatarState } from '@/types';

/** Растровые причёски из `public/avatar-assets/hair/*.png` (цвет уже в графике). */
export function hairRasterSrc(state: AvatarState): string | null {
  const { hairStyle, hairColor } = state;
  if (hairStyle === 'pony') {
    if (hairColor === 'blonde') return '/avatar-assets/hair/pony_blonde.png';
    return '/avatar-assets/hair/pony_dark.png';
  }
  if (hairStyle === 'bob') {
    if (hairColor === 'blonde') return '/avatar-assets/hair/bob_platinum.png';
    if (hairColor === 'chestnut' || hairColor === 'copper') return '/avatar-assets/hair/bob_auburn.png';
    if (hairColor === 'black') return '/avatar-assets/hair/bob_black.png';
    return '/avatar-assets/hair/bob_platinum.png';
  }
  return null;
}
