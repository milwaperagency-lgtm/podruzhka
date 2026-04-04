import { forwardRef, useMemo } from 'react';
import type Konva from 'konva';
import { Stage, Layer, Group, Ellipse, Line, Arc, Rect, Image as KonvaImage } from 'react-konva';
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

const SKIN: Record<string, string> = {
  porcelain: '#FCE4D8',
  light: '#F2C8B5',
  medium: '#E0A789',
  tan: '#C6865E',
  deep: '#8D5524',
};

const HAIR: Record<string, string> = {
  black: '#1A1410',
  chestnut: '#6B3E26',
  blonde: '#E8C87A',
  copper: '#C15B3A',
  pink: '#F5A6C8',
  lilac: '#C4A8E8',
};

const EYES_FALLBACK: Record<string, string> = {
  brown: '#5C3D2E',
  green: '#4A8C5C',
  blue: '#4A7AB8',
};

const LIP_FALLBACK: Record<string, string> = {
  none: 'transparent',
  nude: '#D4A090',
  rose: '#E07090',
  berry: '#A03058',
  red: '#C41E3A',
  coral: '#FF7A6A',
};

const SHADOW: Record<string, string> = {
  none: 'transparent',
  nude_smoke: 'rgba(120,90,90,0.25)',
  rose_gold: 'rgba(200,120,140,0.35)',
  mauve: 'rgba(140,100,160,0.35)',
  smoky: 'rgba(40,40,55,0.45)',
};

const BLUSH_C: Record<string, string> = {
  none: 'transparent',
  peach: 'rgba(255,160,140,0.35)',
  rose: 'rgba(240,120,160,0.38)',
  berry: 'rgba(180,60,100,0.32)',
};

const HI_C: Record<string, string> = {
  none: 'transparent',
  pearl: 'rgba(255,255,255,0.55)',
  gold: 'rgba(255,220,160,0.45)',
  pink_glow: 'rgba(255,200,220,0.5)',
};

function faceScale(shape: string): { rx: number; ry: number } {
  if (shape === 'round') return { rx: 72, ry: 78 };
  if (shape === 'heart') return { rx: 70, ry: 82 };
  return { rx: 68, ry: 80 };
}

function imgGet(m: Map<string, HTMLImageElement | null>, url: string | null): HTMLImageElement | null {
  if (!url) return null;
  return m.get(url) ?? null;
}

export interface BeautyAvatarCanvasProps {
  state: AvatarState;
}

const BeautyAvatarCanvas = forwardRef<Konva.Stage, BeautyAvatarCanvasProps>(
  function BeautyAvatarCanvas({ state }, ref) {
    const cx = W / 2;
    const neckY = 230;
    const { rx, ry } = faceScale(state.faceShape);
    const skin = SKIN[state.skinTone] ?? SKIN.medium;
    const hairCol = HAIR[state.hairColor] ?? HAIR.chestnut;
    const eyeFallback = EYES_FALLBACK[state.eyeColor] ?? EYES_FALLBACK.brown;
    const lashLen = state.lashes === 'volume' ? 10 : state.lashes === 'long' ? 8 : 5;

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
    const hasSkinBase = Boolean(imgGet(images, skinU));
    const hasRasterEye = Boolean(imgGet(images, eyeU));
    const hasRasterLash = Boolean(imgGet(images, lashU));
    const hasRasterLip = state.lipstick !== 'none' && Boolean(lipUrl && imgGet(images, lipUrl));
    const hasRasterHair = Boolean(imgGet(images, hairU));
    const bagU = bagSrc();

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

          {imgGet(images, shoeU) ? (
            <KonvaImage
              image={imgGet(images, shoeU)!}
              x={L.shoes.x}
              y={L.shoes.y}
              width={L.shoes.w}
              height={L.shoes.h}
              listening={false}
            />
          ) : (
            <Group y={H - 36}>
              <Ellipse
                x={cx - 34}
                y={14}
                radiusX={24}
                radiusY={10}
                fill={state.shoes.startsWith('heels') ? '#2A2020' : state.shoes === 'boots' ? '#4A3A38' : '#FFFFFF'}
                stroke="#DDD"
                strokeWidth={1}
              />
              <Ellipse
                x={cx + 34}
                y={14}
                radiusX={24}
                radiusY={10}
                fill={state.shoes.startsWith('heels') ? '#2A2020' : state.shoes === 'boots' ? '#4A3A38' : '#F8E8F2'}
                stroke="#DDD"
                strokeWidth={1}
              />
            </Group>
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

          {!hasSkinBase && (!outfitU || !imgGet(images, outfitU!)) ? (
            <Group y={neckY}>
              <Ellipse x={cx} y={40} radiusX={108} radiusY={52} fill={skin} />
              {state.outfitMode === 'dress' && state.dress !== 'none' ? (
                <Line
                  points={[cx - 95, 55, cx + 95, 55, cx + 72, 152, cx - 72, 152]}
                  closed
                  fill={state.dress === 'cocktail' ? '#E91E8C' : state.dress === 'slip' ? '#F8B4D9' : '#C8E6D5'}
                />
              ) : (
                <Line
                  points={[cx - 88, 48, cx + 88, 48, cx + 80, 122, cx - 80, 122]}
                  closed
                  fill="#FFFFFF"
                  stroke="#E8C4D8"
                  strokeWidth={1}
                />
              )}
            </Group>
          ) : null}

          {!hasSkinBase && <Rect x={cx - 28} y={neckY - 8} width={56} height={44} fill={skin} cornerRadius={8} />}

          {!hasSkinBase && !hasRasterHair && (
            <Ellipse x={cx} y={140} radiusX={115} radiusY={150} fill={hairCol} opacity={0.92} />
          )}

          {!hasSkinBase && (
            <Ellipse x={cx} y={165} radiusX={rx} radiusY={ry} fill={skin} stroke="#E8B8A8" strokeWidth={1} />
          )}

          {blushSrc(state) && imgGet(images, blushSrc(state)!) && (
            <KonvaImage
              image={imgGet(images, blushSrc(state)!)!}
              x={L.makeupBlush.x}
              y={L.makeupBlush.y}
              width={L.makeupBlush.w}
              height={L.makeupBlush.h}
              opacity={0.45}
              listening={false}
            />
          )}
          {state.eyeshadow !== 'none' && !eyeshadowSrc(state) && (
            <>
              <Ellipse x={cx - 32} y={158} radiusX={26} radiusY={14} fill={SHADOW[state.eyeshadow]} />
              <Ellipse x={cx + 32} y={158} radiusX={26} radiusY={14} fill={SHADOW[state.eyeshadow]} />
            </>
          )}
          {eyeshadowSrc(state) && imgGet(images, eyeshadowSrc(state)!) && (
            <KonvaImage
              image={imgGet(images, eyeshadowSrc(state)!)!}
              x={L.makeupLiner.x}
              y={L.makeupLiner.y}
              width={L.makeupLiner.w}
              height={L.makeupLiner.h}
              opacity={0.55}
              listening={false}
            />
          )}
          {highlighterSrc(state) && imgGet(images, highlighterSrc(state)!) && (
            <KonvaImage
              image={imgGet(images, highlighterSrc(state)!)!}
              x={L.makeupHi.x}
              y={L.makeupHi.y}
              width={L.makeupHi.w}
              height={L.makeupHi.h}
              opacity={0.4}
              listening={false}
            />
          )}

          {!hasSkinBase && imgGet(images, browU) && (
            <KonvaImage
              image={imgGet(images, browU)!}
              x={L.brows.x}
              y={L.brows.y}
              width={L.brows.w}
              height={L.brows.h}
              listening={false}
            />
          )}

          {hasRasterEye ? (
            <KonvaImage
              image={imgGet(images, eyeU)!}
              x={L.eyes.x}
              y={L.eyes.y}
              width={L.eyes.w}
              height={L.eyes.h}
              listening={false}
            />
          ) : (
            <>
              <Ellipse x={cx - 32} y={162} radiusX={14} radiusY={10} fill="#FFFFFF" />
              <Ellipse x={cx + 32} y={162} radiusX={14} radiusY={10} fill="#FFFFFF" />
              <Ellipse x={cx - 32} y={162} radiusX={7} radiusY={7} fill={eyeFallback} />
              <Ellipse x={cx + 32} y={162} radiusX={7} radiusY={7} fill={eyeFallback} />
              <Ellipse x={cx - 30} y={160} radiusX={3} radiusY={2} fill="#FFFFFF" opacity={0.7} />
              <Ellipse x={cx + 34} y={160} radiusX={3} radiusY={2} fill="#FFFFFF" opacity={0.7} />
            </>
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

          {!hasRasterLash &&
            [-32, 32].map((ox) => (
              <Group key={ox}>
                {[-1, 0, 1].map((i) => (
                  <Line
                    key={i}
                    points={[cx + ox - 10 + i * 8, 152, cx + ox - 10 + i * 8 - 2, 152 - lashLen]}
                    stroke="#2A2020"
                    strokeWidth={state.lashes === 'volume' ? 2.2 : 1.6}
                    lineCap="round"
                  />
                ))}
              </Group>
            ))}

          {state.blush !== 'none' && !blushSrc(state) && (
            <>
              <Ellipse x={cx - 52} y={178} radiusX={18} radiusY={12} fill={BLUSH_C[state.blush]} />
              <Ellipse x={cx + 52} y={178} radiusX={18} radiusY={12} fill={BLUSH_C[state.blush]} />
            </>
          )}

          {state.highlighter !== 'none' && !highlighterSrc(state) && (
            <>
              <Ellipse x={cx - 48} y={168} radiusX={12} radiusY={8} fill={HI_C[state.highlighter]} />
              <Ellipse x={cx + 48} y={168} radiusX={12} radiusY={8} fill={HI_C[state.highlighter]} />
            </>
          )}

          {hasRasterLip && lipUrl ? (
            <KonvaImage
              image={imgGet(images, lipUrl)!}
              x={L.lips.x}
              y={L.lips.y}
              width={L.lips.w}
              height={L.lips.h}
              listening={false}
            />
          ) : (
            <Ellipse
              x={cx}
              y={192}
              radiusX={22}
              radiusY={9}
              fill={
                LIP_FALLBACK[state.lipstick] === 'transparent' ? '#D89090' : LIP_FALLBACK[state.lipstick]
              }
              opacity={state.lipstick === 'none' ? 0.55 : 0.95}
            />
          )}

          {hasRasterHair && hairU && (
            <KonvaImage
              image={imgGet(images, hairU)!}
              x={L.hair.x}
              y={L.hair.y}
              width={L.hair.w}
              height={L.hair.h}
              listening={false}
            />
          )}
          {!hasRasterHair && (
            <>
              <Ellipse x={cx - 55} y={125} radiusX={38} radiusY={48} fill={hairCol} />
              <Ellipse x={cx + 55} y={125} radiusX={38} radiusY={48} fill={hairCol} />
            </>
          )}

          {state.earrings !== 'none' && earringSrc(state) && imgGet(images, earringSrc(state)!) && (
            <KonvaImage
              image={imgGet(images, earringSrc(state)!)!}
              x={L.earrings.x}
              y={L.earrings.y}
              width={L.earrings.w}
              height={L.earrings.h}
              listening={false}
            />
          )}
          {state.earrings !== 'none' && !imgGet(images, earringSrc(state)!) && (
            <>
              <Ellipse x={cx - rx - 6} y={172} radiusX={5} radiusY={5} fill="#F0D060" />
              <Ellipse x={cx + rx + 6} y={172} radiusX={5} radiusY={5} fill="#F0D060" />
              {state.earrings === 'hoops' && (
                <>
                  <Arc
                    x={cx - rx - 6}
                    y={172}
                    innerRadius={6}
                    outerRadius={8}
                    angle={320}
                    stroke="#D4A020"
                    strokeWidth={2}
                  />
                  <Arc
                    x={cx + rx + 6}
                    y={172}
                    innerRadius={6}
                    outerRadius={8}
                    angle={320}
                    stroke="#D4A020"
                    strokeWidth={2}
                  />
                </>
              )}
            </>
          )}

          {jacketOverlaySrc(state) && imgGet(images, jacketOverlaySrc(state)!) && (
            <KonvaImage
              image={imgGet(images, jacketOverlaySrc(state)!)!}
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
          {state.bag !== 'none' && !imgGet(images, bagU) && (
            <Group x={cx + 100} y={240}>
              <Rect width={36} height={44} cornerRadius={6} fill="#E91E8C" opacity={0.85} />
              <Line points={[0, 0, 18, -18, 36, 0]} stroke="#9B1B5A" strokeWidth={3} lineCap="round" />
            </Group>
          )}
        </Layer>
      </Stage>
    );
  }
);

export default BeautyAvatarCanvas;
