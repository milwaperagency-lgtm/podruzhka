/**
 * Растровые слои тела / одежды / волос из `avatar-assets/body/`
 * (копируются скриптом copy-assets-bundle.cjs из набора в Downloads/assets/assets/…/body или …/generated).
 * Лицо — partsPack.ts.
 */
import type { AvatarState } from '@/types';
import { publicUrl } from '@/lib/publicUrl';

const BASE = () => publicUrl('avatar-assets/body');

function hairStyleKey(s: string): 'bob' | 'pony' | 'long' {
  if (s === 'bob') return 'bob';
  if (s === 'pony') return 'pony';
  return 'long';
}

const HAIR_COLORS = ['black', 'chestnut', 'blonde', 'copper', 'pink', 'lilac'] as const;
function hairColorKey(c: string): (typeof HAIR_COLORS)[number] {
  return (HAIR_COLORS as readonly string[]).includes(c) ? (c as (typeof HAIR_COLORS)[number]) : 'chestnut';
}

export const L = {
  faceFull: { x: 0, y: 0, w: 320, h: 420 },
  hair: { x: 26, y: 26, w: 268, h: 338 },
  outfit: { x: 22, y: 198, w: 276, h: 210 },
  shoes: { x: 44, y: 358, w: 232, h: 56 },
  earrings: { x: 0, y: 0, w: 320, h: 420 },
  jacket: { x: 20, y: 168, w: 280, h: 240 },
  bag: { x: 188, y: 248, w: 120, h: 140 },
};

export function bagSrc(): string {
  return `${BASE()}/bag_crossbody.png`;
}

export function hairSrc(state: AvatarState): string {
  const style = hairStyleKey(state.hairStyle);
  const color = hairColorKey(state.hairColor);
  return `${BASE()}/hair_${style}_${color}.png`;
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
