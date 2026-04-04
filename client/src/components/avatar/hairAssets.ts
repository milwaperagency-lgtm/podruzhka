import type { AvatarState } from '@/types';

function ponyUrl(hairColor: string): string {
  if (hairColor === 'blonde') return '/avatar-assets/hair/pony_blonde.png';
  return '/avatar-assets/hair/pony_dark.png';
}

function bobUrl(hairColor: string): string {
  if (hairColor === 'blonde') return '/avatar-assets/hair/bob_platinum.png';
  if (hairColor === 'chestnut' || hairColor === 'copper') return '/avatar-assets/hair/bob_auburn.png';
  if (hairColor === 'black') return '/avatar-assets/hair/bob_black.png';
  return '/avatar-assets/hair/bob_platinum.png';
}

/**
 * Растровые причёски из `public/avatar-assets/hair/*.png`.
 * Длинные стили временно используют те же спрайты, что каре/хвост — иначе остаются «круги» из вектора.
 */
export function hairRasterSrc(state: AvatarState): string | null {
  const { hairStyle, hairColor } = state;
  if (hairStyle === 'pony' || hairStyle === 'long_wavy') {
    return ponyUrl(hairColor);
  }
  if (hairStyle === 'bob' || hairStyle === 'long_straight') {
    return bobUrl(hairColor);
  }
  return null;
}
