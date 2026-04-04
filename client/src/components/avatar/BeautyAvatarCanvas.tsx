import { forwardRef, useMemo } from 'react';
import type Konva from 'konva';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import type { AvatarState } from '@/types';
import {
  bottomSrc,
  collectCasualPreloadUrls,
  dressSrc,
  hairBackSrc,
  hairBangsSrc,
  jacketSrc,
  jewelrySrc,
  L,
  shoeSrc,
  topSrc,
  underwearSrc,
} from '@/components/avatar/casualPack';
import { skinBaseSrc, L_SKIN } from '@/components/avatar/skinPack';
import {
  baseWhiteEyesSrc,
  collectFacePartUrls,
  L_FACE,
  partDecorFaceSrc,
  partEarsSrc,
  partEyebrowsSrc,
  partEyelashesSrc,
  partEyeWhiteSrc,
  partMouthSrc,
  partNoseSrc,
  partPupilSrc,
} from '@/components/avatar/partsPack';
import { useLoadedImages } from '@/components/avatar/useGeneratedImages';

const W = 320;
const H = 420;

function imgGet(m: Map<string, HTMLImageElement | null>, url: string | null): HTMLImageElement | null {
  if (!url) return null;
  return m.get(url) ?? null;
}

export interface BeautyAvatarCanvasProps {
  state: AvatarState;
}

/**
 * Ориентир — силуэт `base_*.png`: все слои в тех же 320×420 (`L.full` / `L_FACE`), что и база тела.
 * Слои (снизу вверх): фон → база кожи → бельё → низ/верх или платье → жакет → обувь →
 * зад волос (за спиной/плечами) → лицо (губы последними в группе лица) → украшение → чёлка (самый верх).
 */
const BeautyAvatarCanvas = forwardRef<Konva.Stage, BeautyAvatarCanvasProps>(
  function BeautyAvatarCanvas({ state }, ref) {
    const tone = state.hairTone === 'b' ? 'b' : 'a';
    const skinU = skinBaseSrc(state);
    const shoeU = shoeSrc(state.casualShoes);
    const undU = underwearSrc(state.casualUnderwear);
    const botU = bottomSrc(state.casualBottom);
    const topU = topSrc(state.casualTop);
    const dressU = dressSrc(state.casualDress);
    const jackU = state.casualJacket !== 'none' ? jacketSrc(state.casualJacket) : null;
    const hbU = hairBackSrc(state.hairSet, tone);
    const bangsU = hairBangsSrc(state.hairBangs);
    const jewU = jewelrySrc(state.casualJewelry);

    const faceUrls = useMemo(() => collectFacePartUrls(state), [state]);
    const urls = useMemo(
      () => [skinU, ...collectCasualPreloadUrls(state), ...faceUrls],
      [state, faceUrls, skinU]
    );
    const images = useLoadedImages(urls);

    const whiteU = baseWhiteEyesSrc();
    const eyeWU = partEyeWhiteSrc(state.partEyeWhite);
    const pupilU = partPupilSrc(state.partPupil);
    const noseU = partNoseSrc(state.partNose);
    const mouthU = partMouthSrc(state.partMouth);
    const browU = partEyebrowsSrc(state.partEyebrows);
    const lashU = partEyelashesSrc(state.partEyelashes);
    const decorU = partDecorFaceSrc(state.partDecorFace);
    const earsU = partEarsSrc(state.partEars);

    const separate = state.outfitMode === 'separate';

    return (
      <Stage width={W} height={H} ref={ref}>
        <Layer listening={false}>
          <Rect
            x={0}
            y={0}
            width={W}
            height={H}
            cornerRadius={24}
            fillLinearGradientStartPoint={{ x: 0, y: 0 }}
            fillLinearGradientEndPoint={{ x: W, y: H }}
            fillLinearGradientColorStops={[0, '#FDE8F2', 0.5, '#FFF5FA', 1, '#E8F5F0']}
          />

          {imgGet(images, skinU) && (
            <KonvaImage
              image={imgGet(images, skinU)!}
              x={L_SKIN.x}
              y={L_SKIN.y}
              width={L_SKIN.w}
              height={L_SKIN.h}
              listening={false}
            />
          )}

          {imgGet(images, undU) && (
            <KonvaImage
              image={imgGet(images, undU)!}
              x={L.full.x}
              y={L.full.y}
              width={L.full.w}
              height={L.full.h}
              listening={false}
            />
          )}
          {separate && imgGet(images, botU) && (
            <KonvaImage
              image={imgGet(images, botU)!}
              x={L.full.x}
              y={L.full.y}
              width={L.full.w}
              height={L.full.h}
              listening={false}
            />
          )}
          {separate && imgGet(images, topU) && (
            <KonvaImage
              image={imgGet(images, topU)!}
              x={L.full.x}
              y={L.full.y}
              width={L.full.w}
              height={L.full.h}
              listening={false}
            />
          )}
          {!separate && imgGet(images, dressU) && (
            <KonvaImage
              image={imgGet(images, dressU)!}
              x={L.full.x}
              y={L.full.y}
              width={L.full.w}
              height={L.full.h}
              listening={false}
            />
          )}
          {jackU && imgGet(images, jackU) && (
            <KonvaImage
              image={imgGet(images, jackU)!}
              x={L.full.x}
              y={L.full.y}
              width={L.full.w}
              height={L.full.h}
              listening={false}
            />
          )}
          {imgGet(images, shoeU) && (
            <KonvaImage
              image={imgGet(images, shoeU)!}
              x={L.full.x}
              y={L.full.y}
              width={L.full.w}
              height={L.full.h}
              listening={false}
            />
          )}

          {/* Зад волос — над одеждой, иначе ворот «срезает» пряди */}
          {imgGet(images, hbU) && (
            <KonvaImage
              image={imgGet(images, hbU)!}
              x={L.full.x}
              y={L.full.y}
              width={L.full.w}
              height={L.full.h}
              listening={false}
            />
          )}

          {imgGet(images, whiteU) && (
            <KonvaImage
              image={imgGet(images, whiteU)!}
              x={L_FACE.x}
              y={L_FACE.y}
              width={L_FACE.w}
              height={L_FACE.h}
              listening={false}
            />
          )}
          {imgGet(images, eyeWU) && (
            <KonvaImage
              image={imgGet(images, eyeWU)!}
              x={L_FACE.x}
              y={L_FACE.y}
              width={L_FACE.w}
              height={L_FACE.h}
              listening={false}
            />
          )}
          {imgGet(images, pupilU) && (
            <KonvaImage
              image={imgGet(images, pupilU)!}
              x={L_FACE.x}
              y={L_FACE.y}
              width={L_FACE.w}
              height={L_FACE.h}
              listening={false}
            />
          )}
          {imgGet(images, noseU) && (
            <KonvaImage
              image={imgGet(images, noseU)!}
              x={L_FACE.x}
              y={L_FACE.y}
              width={L_FACE.w}
              height={L_FACE.h}
              listening={false}
            />
          )}
          {imgGet(images, browU) && (
            <KonvaImage
              image={imgGet(images, browU)!}
              x={L_FACE.x}
              y={L_FACE.y}
              width={L_FACE.w}
              height={L_FACE.h}
              listening={false}
            />
          )}
          {imgGet(images, lashU) && (
            <KonvaImage
              image={imgGet(images, lashU)!}
              x={L_FACE.x}
              y={L_FACE.y}
              width={L_FACE.w}
              height={L_FACE.h}
              listening={false}
            />
          )}
          {decorU && imgGet(images, decorU) && (
            <KonvaImage
              image={imgGet(images, decorU)!}
              x={L_FACE.x}
              y={L_FACE.y}
              width={L_FACE.w}
              height={L_FACE.h}
              listening={false}
            />
          )}
          {earsU && imgGet(images, earsU) && (
            <KonvaImage
              image={imgGet(images, earsU)!}
              x={L_FACE.x}
              y={L_FACE.y}
              width={L_FACE.w}
              height={L_FACE.h}
              listening={false}
            />
          )}
          {imgGet(images, mouthU) && (
            <KonvaImage
              image={imgGet(images, mouthU)!}
              x={L_FACE.x}
              y={L_FACE.y}
              width={L_FACE.w}
              height={L_FACE.h}
              listening={false}
            />
          )}

          {jewU && imgGet(images, jewU) && (
            <KonvaImage
              image={imgGet(images, jewU)!}
              x={L.full.x}
              y={L.full.y}
              width={L.full.w}
              height={L.full.h}
              listening={false}
            />
          )}

          {imgGet(images, bangsU) && (
            <KonvaImage
              image={imgGet(images, bangsU)!}
              x={L.full.x}
              y={L.full.y}
              width={L.full.w}
              height={L.full.h}
              listening={false}
            />
          )}
        </Layer>
      </Stage>
    );
  }
);

export default BeautyAvatarCanvas;
