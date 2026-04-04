import { forwardRef, useMemo } from 'react';
import type Konva from 'konva';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import type { AvatarState } from '@/types';
import {
  bagSrc,
  blushSrc,
  browSrc,
  earringSrc,
  eyeshadowSrc,
  eyeSrc,
  hairSrc,
  highlighterSrc,
  jacketOverlaySrc,
  lashSrc,
  lipSrc,
  L,
  outfitSrc,
  shoeSrc,
  skinBaseSrc,
} from '@/components/avatar/generatedPack';
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

/** Только растровые слои из `public/avatar-assets/…` — без векторных «кукол». */
const BeautyAvatarCanvas = forwardRef<Konva.Stage, BeautyAvatarCanvasProps>(
  function BeautyAvatarCanvas({ state }, ref) {
    const lipUrl: string | null = lipSrc(state);
    const skinU = skinBaseSrc(state);
    const lashU = lashSrc(state);
    const urls = useMemo((): (string | null)[] => {
      const list: (string | null)[] = [
        skinU,
        shoeSrc(state),
        eyeSrc(state),
        lashU,
        hairSrc(state),
        browSrc(state),
      ];
      const o = outfitSrc(state);
      if (o) list.push(o);
      if (state.lipstick !== 'none' && lipUrl !== null) list.push(lipUrl);
      const mb = blushSrc(state);
      const me = eyeshadowSrc(state);
      const mh = highlighterSrc(state);
      if (mb) list.push(mb);
      if (me) list.push(me);
      if (mh) list.push(mh);
      const e = earringSrc(state);
      if (e) list.push(e);
      const j = jacketOverlaySrc(state);
      if (j) list.push(j);
      if (state.bag !== 'none') list.push(bagSrc());
      return list;
    }, [state, lipUrl, skinU, lashU]);

    const images = useLoadedImages(urls);

    const shoeU = shoeSrc(state);
    const outfitU = outfitSrc(state);
    const eyeU = eyeSrc(state);
    const hairU = hairSrc(state);
    const browU = browSrc(state);
    const bagU = bagSrc();

    const hasSkinBase = Boolean(imgGet(images, skinU));
    const hasRasterEye = Boolean(imgGet(images, eyeU));
    const hasRasterLash = Boolean(imgGet(images, lashU));
    const hasRasterLip = state.lipstick !== 'none' && Boolean(lipUrl && imgGet(images, lipUrl));
    const hasRasterHair = Boolean(imgGet(images, hairU));
    const hasBrows = Boolean(imgGet(images, browU));

    const blushU = blushSrc(state);
    const esU = eyeshadowSrc(state);
    const hiU = highlighterSrc(state);
    const earU = earringSrc(state);
    const jackU = jacketOverlaySrc(state);

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

          {hasSkinBase && (
            <KonvaImage
              image={imgGet(images, skinU)!}
              x={L.skinBase.x}
              y={L.skinBase.y}
              width={L.skinBase.w}
              height={L.skinBase.h}
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

          {blushU && imgGet(images, blushU) && (
            <KonvaImage
              image={imgGet(images, blushU)!}
              x={L.makeupBlush.x}
              y={L.makeupBlush.y}
              width={L.makeupBlush.w}
              height={L.makeupBlush.h}
              opacity={0.45}
              listening={false}
            />
          )}
          {esU && imgGet(images, esU) && (
            <KonvaImage
              image={imgGet(images, esU)!}
              x={L.makeupLiner.x}
              y={L.makeupLiner.y}
              width={L.makeupLiner.w}
              height={L.makeupLiner.h}
              opacity={0.55}
              listening={false}
            />
          )}
          {hiU && imgGet(images, hiU) && (
            <KonvaImage
              image={imgGet(images, hiU)!}
              x={L.makeupHi.x}
              y={L.makeupHi.y}
              width={L.makeupHi.w}
              height={L.makeupHi.h}
              opacity={0.4}
              listening={false}
            />
          )}

          {hasSkinBase && hasBrows && (
            <KonvaImage
              image={imgGet(images, browU)!}
              x={L.brows.x}
              y={L.brows.y}
              width={L.brows.w}
              height={L.brows.h}
              listening={false}
            />
          )}

          {hasRasterEye && (
            <KonvaImage
              image={imgGet(images, eyeU)!}
              x={L.eyes.x}
              y={L.eyes.y}
              width={L.eyes.w}
              height={L.eyes.h}
              listening={false}
            />
          )}

          {hasRasterLash && (
            <KonvaImage
              image={imgGet(images, lashU)!}
              x={L.lashes.x}
              y={L.lashes.y}
              width={L.lashes.w}
              height={L.lashes.h}
              listening={false}
            />
          )}

          {hasRasterLip && lipUrl && (
            <KonvaImage
              image={imgGet(images, lipUrl)!}
              x={L.lips.x}
              y={L.lips.y}
              width={L.lips.w}
              height={L.lips.h}
              listening={false}
            />
          )}

          {hasRasterHair && (
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
