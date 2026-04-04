/**
 * Слои тела из набора «feminine casual» — WebP в `avatar-assets/casual/`
 * (скрипт: npm run copy:casual-outfits).
 */
import type { AvatarState } from '@/types';
import { publicUrl } from '@/lib/publicUrl';

const BASE = () => publicUrl('avatar-assets/casual');

export const L = { full: { x: 0, y: 0, w: 320, h: 420 } };

export function shoeSrc(id: string): string {
  return `${BASE()}/shoes/${id}.webp`;
}

export function underwearSrc(id: string): string {
  return `${BASE()}/underwear/${id}.webp`;
}

export function bottomSrc(id: string): string {
  return `${BASE()}/bottom/${id}.webp`;
}

export function topSrc(id: string): string {
  return `${BASE()}/top/${id}.webp`;
}

export function dressSrc(id: string): string {
  return `${BASE()}/dress/${id}.webp`;
}

export function jacketSrc(id: string): string {
  return `${BASE()}/jacket/${id}.webp`;
}

export function hairBackSrc(hairSet: string, hairTone: 'a' | 'b'): string {
  return `${BASE()}/hair_back/${hairSet}${hairTone}.webp`;
}

export function hairBangsSrc(id: string): string {
  return `${BASE()}/hair_bangs/${id}.webp`;
}

export function jewelrySrc(id: string): string | null {
  if (id === 'none') return null;
  return `${BASE()}/jewelry/${id}.webp`;
}

/** Все URL слоёв тела для предзагрузки (порядок не важен). */
export function collectCasualPreloadUrls(state: AvatarState): string[] {
  const u: string[] = [];
  u.push(shoeSrc(state.casualShoes));
  u.push(underwearSrc(state.casualUnderwear));
  if (state.outfitMode === 'separate') {
    u.push(bottomSrc(state.casualBottom));
    u.push(topSrc(state.casualTop));
  } else {
    u.push(dressSrc(state.casualDress));
  }
  if (state.casualJacket !== 'none') u.push(jacketSrc(state.casualJacket));
  const tone = state.hairTone === 'b' ? 'b' : 'a';
  u.push(hairBackSrc(state.hairSet, tone));
  u.push(hairBangsSrc(state.hairBangs));
  const j = jewelrySrc(state.casualJewelry);
  if (j) u.push(j);
  return u;
}
