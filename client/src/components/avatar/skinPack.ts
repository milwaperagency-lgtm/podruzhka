/**
 * Базовый слой тона кожи: `avatar-assets/skin/base_light|medium|deep`
 * По умолчанию `.svg` (лежат в репозитории).
 * После `npm run copy:skin-png` положите PNG рядом и задайте `VITE_SKIN_EXT=png` в `client/.env`.
 */
import type { AvatarState } from '@/types';
import { normalizeSkinToneId } from '@/types';
import { publicUrl } from '@/lib/publicUrl';

export const L_SKIN = { x: 0, y: 0, w: 320, h: 420 };

const SKIN_EXT = (import.meta.env.VITE_SKIN_EXT as string | undefined) || 'svg';

export function skinBaseSrc(state: AvatarState): string {
  const k = normalizeSkinToneId(state.skinTone);
  return publicUrl(`avatar-assets/skin/base_${k}.${SKIN_EXT}`);
}
