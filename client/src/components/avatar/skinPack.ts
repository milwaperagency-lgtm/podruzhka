/**
 * Базовый слой тела/кожи: PNG в `avatar-assets/bases/base_light|medium|deep.png`.
 */
import type { AvatarState } from '@/types';
import { normalizeSkinToneId } from '@/types';
import { publicUrl } from '@/lib/publicUrl';

export const L_SKIN = { x: 0, y: 0, w: 320, h: 420 };

export function skinBaseSrc(state: AvatarState): string {
  const k = normalizeSkinToneId(state.skinTone);
  return publicUrl(`avatar-assets/bases/base_${k}.png`);
}
