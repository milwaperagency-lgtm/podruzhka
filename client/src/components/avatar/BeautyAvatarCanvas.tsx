import { forwardRef, useMemo } from 'react';
import type Konva from 'konva';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import type { AvatarState } from '@/types';
import {
  bagSrc,
  earringSrc,
  hairSrc,
  jacketOverlaySrc,
  L,
  outfitSrc,
  shoeSrc,
} from '@/components/avatar/bodyPack';
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
 * Слои: обувь → одежда → жакет → лицо (база белых глаз → склера → зрачки → нос → рот → брови → ресницы → декор → уши) → волосы → серьги → сумка.
 * Только PNG из `parts/` и `body/` (набор из ASSETS_BUNDLE).
 */
const BeautyAvatarCanvas = forwardRef<Konva.Stage, BeautyAvatarCanvasProps>(
  function BeautyAvatarCanvas({ state }, ref) {
    const shoeU = shoeSrc(state);
    const outfitU = outfitSrc(state);
    const jackU = jacketOverlaySrc(state);
    const hairU = hairSrc(state);
    const earU = earringSrc(state);
    const bagU = bagSrc();

    const faceUrls = useMemo(() => collectFacePartUrls(state), [state]);
    const bodyUrls = useMemo(
      (): (string | null)[] => [
        shoeU,
        outfitU,
        jackU,
        hairU,
        earU,
        state.bag !== 'none' ? bagU : null,
      ],
      [state, shoeU, outfitU, jackU, hairU, earU, bagU]
    );

    const urls = useMemo(() => [...faceUrls, ...bodyUrls.filter(Boolean)], [faceUrls, bodyUrls]);
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

          {imgGet(images, shoeU) && (
            <KonvaImage
              image={imgGet(images, shoeU)!}
              x={L.shoes.x}
              y={L.shoes.y}
              width={L.shoes.w}
              height={L.shoes.h}
              listening={false}
            />
          )}

          {outfitU && imgGet(images, outfitU) && (
            <KonvaImage
              image={imgGet(images, outfitU)!}
              x={L.outfit.x}
              y={L.outfit.y}
              width={L.outfit.w}
              height={L.outfit.h}
              listening={false}
            />
          )}

          {jackU && imgGet(images, jackU) && (
            <KonvaImage
              image={imgGet(images, jackU)!}
              x={L.jacket.x}
              y={L.jacket.y}
              width={L.jacket.w}
              height={L.jacket.h}
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

          {imgGet(images, hairU) && (
            <KonvaImage
              image={imgGet(images, hairU)!}
              x={L.hair.x}
              y={L.hair.y}
              width={L.hair.w}
              height={L.hair.h}
              listening={false}
            />
          )}

          {state.earrings !== 'none' && earU && imgGet(images, earU) && (
            <KonvaImage
              image={imgGet(images, earU)!}
              x={L.earrings.x}
              y={L.earrings.y}
              width={L.earrings.w}
              height={L.earrings.h}
              listening={false}
            />
          )}

          {state.bag !== 'none' && imgGet(images, bagU) && (
            <KonvaImage
              image={imgGet(images, bagU)!}
              x={L.bag.x}
              y={L.bag.y}
              width={L.bag.w}
              height={L.bag.h}
              listening={false}
            />
          )}
        </Layer>
      </Stage>
    );
  }
);

export default BeautyAvatarCanvas;
