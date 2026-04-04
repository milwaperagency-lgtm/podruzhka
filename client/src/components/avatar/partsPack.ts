/**
 * Модульные части лица из `public/avatar-assets/parts/`
 * (копируются `npm run copy:assets` из ASSETS_BUNDLE, по умолчанию Downloads/assets/assets).
 */
import type { AvatarState } from '@/types';
import { publicUrl } from '@/lib/publicUrl';

const PARTS = () => publicUrl('avatar-assets/parts');

/** Все слои лица одного размера, совмещаются в одной сетке превью. */
export const L_FACE = { x: 0, y: 0, w: 320, h: 420 };

export function baseWhiteEyesSrc(): string {
  return `${PARTS()}/base_white_eyes.png`;
}

export function partEarsSrc(id: string): string | null {
  if (id === 'none') return null;
  return `${PARTS()}/ears/${id}.png`;
}

export function partDecorFaceSrc(id: string): string | null {
  if (id === 'none') return null;
  return `${PARTS()}/decor_face/${id}.png`;
}

export function partEyebrowsSrc(id: string): string {
  return `${PARTS()}/eyebrows/${id}.png`;
}

export function partEyelashesSrc(id: string): string {
  return `${PARTS()}/eyelashes/${id}.png`;
}

export function partEyeWhiteSrc(id: string): string {
  return `${PARTS()}/eyes/${id}.png`;
}

export function partPupilSrc(id: string): string {
  return `${PARTS()}/pupils/${id}.png`;
}

export function partNoseSrc(id: string): string {
  return `${PARTS()}/nose/${id}.png`;
}

export function partMouthSrc(id: string): string {
  return `${PARTS()}/mouth/${id}.png`;
}

/**
 * URL частей лица для предзагрузки.
 * Губы — последними, чтобы слои макияжа/ресниц не перекрывали рот.
 */
export function collectFacePartUrls(state: AvatarState): string[] {
  const list: string[] = [baseWhiteEyesSrc()];
  list.push(partEyeWhiteSrc(state.partEyeWhite));
  list.push(partPupilSrc(state.partPupil));
  list.push(partNoseSrc(state.partNose));
  list.push(partEyebrowsSrc(state.partEyebrows));
  list.push(partEyelashesSrc(state.partEyelashes));
  const d = partDecorFaceSrc(state.partDecorFace);
  if (d) list.push(d);
  const e = partEarsSrc(state.partEars);
  if (e) list.push(e);
  list.push(partMouthSrc(state.partMouth));
  return list;
}
