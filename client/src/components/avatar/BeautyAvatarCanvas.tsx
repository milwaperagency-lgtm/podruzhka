import { forwardRef, useEffect, useMemo, useState } from 'react';
import type Konva from 'konva';
import { Stage, Layer, Group, Ellipse, Line, Arc, Rect, Image as KonvaImage } from 'react-konva';
import type { AvatarState } from '@/types';
import { hairRasterSrc } from '@/components/avatar/hairAssets';

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

const EYES: Record<string, string> = {
  brown: '#5C3D2E',
  green: '#4A8C5C',
  blue: '#4A7AB8',
  hazel: '#8B7355',
  grey: '#8A9099',
};

const LIP: Record<string, string> = {
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

export interface BeautyAvatarCanvasProps {
  state: AvatarState;
}

const RASTER_HAIR_W = 235;
const RASTER_HAIR_Y = 44;

const BeautyAvatarCanvas = forwardRef<Konva.Stage, BeautyAvatarCanvasProps>(
  function BeautyAvatarCanvas({ state }, ref) {
    const cx = W / 2;
    const neckY = 230;
    const { rx, ry } = faceScale(state.faceShape);
    const skin = SKIN[state.skinTone] ?? SKIN.medium;
    const hair = HAIR[state.hairColor] ?? HAIR.chestnut;
    const eye = EYES[state.eyeColor] ?? EYES.brown;

    const lashLen = state.lashes === 'volume' ? 10 : state.lashes === 'long' ? 8 : 5;

    const hairBack = useMemo(() => {
      const hw = state.hairStyle === 'pixie' ? 85 : state.hairStyle === 'bob' ? 95 : 115;
      const hh = state.hairStyle === 'bun' ? 40 : state.hairStyle === 'pony' ? 130 : 150;
      return { hw, hh };
    }, [state.hairStyle]);

    const rasterHairUrl = hairRasterSrc(state);
    const [hairImg, setHairImg] = useState<HTMLImageElement | null>(null);
    useEffect(() => {
      if (!rasterHairUrl) {
        setHairImg(null);
        return;
      }
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => setHairImg(img);
      img.onerror = () => setHairImg(null);
      img.src = rasterHairUrl;
    }, [rasterHairUrl]);

    const rasterHairDims = useMemo(() => {
      if (!hairImg?.width) return { w: RASTER_HAIR_W, h: 180 };
      const w = RASTER_HAIR_W;
      const h = (hairImg.height / hairImg.width) * w;
      return { w, h };
    }, [hairImg]);

    const useRasterHair = Boolean(rasterHairUrl && hairImg);

    return (
      <Stage width={W} height={H} ref={ref}>
        <Layer listening={false}>
          <Rect x={0} y={0} width={W} height={H} cornerRadius={24} fillLinearGradientStartPoint={{ x: 0, y: 0 }} fillLinearGradientEndPoint={{ x: W, y: H }} fillLinearGradientColorStops={[0, '#FDE8F2', 0.5, '#FFF5FA', 1, '#E8F5F0']} />

          {/* Hair back (векторная заглушка, если нет PNG) */}
          {!useRasterHair && (
            <Ellipse x={cx} y={140} radiusX={hairBack.hw} radiusY={hairBack.hh} fill={hair} opacity={0.95} />
          )}

          {/* Shoulders / top */}
          <Group y={neckY}>
            <Ellipse x={cx} y={40} radiusX={108} radiusY={52} fill={skin} />
            {state.outfitMode === 'dress' && state.dress !== 'none' ? (
              <Group>
                <Line
                  points={[cx - 95, 55, cx + 95, 55, cx + 75, 200, cx - 75, 200]}
                  closed
                  fill={state.dress === 'cocktail' ? '#E91E8C' : state.dress === 'slip' ? '#F8B4D9' : '#C8E6D5'}
                />
              </Group>
            ) : (
              <Group>
                <Line
                  points={[cx - 88, 48, cx + 88, 48, cx + 82, 165, cx - 82, 165]}
                  closed
                  fill={
                    state.top === 'tee_white'
                      ? '#FFFFFF'
                      : state.top === 'tee_blush'
                        ? '#FDE8F2'
                        : state.top === 'hoodie'
                          ? '#E8E0F5'
                          : state.top === 'crop_top'
                            ? '#F8B4D9'
                            : '#FFFFFF'
                  }
                  stroke="#E8C4D8"
                  strokeWidth={1}
                />
              </Group>
            )}
            {state.jacket !== 'none' && (
              <Line
                points={[cx - 92, 42, cx + 92, 42, cx + 90, 170, cx - 90, 170]}
                closed
                fill={state.jacket === 'denim' ? '#6B8CCE' : state.jacket === 'cardigan' ? '#F5D6E8' : '#D8C4E8'}
                opacity={0.92}
              />
            )}
          </Group>

          {/* Neck */}
          <Rect x={cx - 28} y={neckY - 8} width={56} height={44} fill={skin} cornerRadius={8} />

          {/* Face */}
          <Ellipse x={cx} y={165} radiusX={rx} radiusY={ry} fill={skin} stroke="#E8B8A8" strokeWidth={1} />

          {/* Eyeshadow */}
          {state.eyeshadow !== 'none' && (
            <>
              <Ellipse x={cx - 32} y={158} radiusX={26} radiusY={14} fill={SHADOW[state.eyeshadow]} />
              <Ellipse x={cx + 32} y={158} radiusX={26} radiusY={14} fill={SHADOW[state.eyeshadow]} />
            </>
          )}

          {/* Eyes */}
          <Ellipse x={cx - 32} y={162} radiusX={14} radiusY={10} fill="#FFFFFF" />
          <Ellipse x={cx + 32} y={162} radiusX={14} radiusY={10} fill="#FFFFFF" />
          <Ellipse x={cx - 32} y={162} radiusX={7} radiusY={7} fill={eye} />
          <Ellipse x={cx + 32} y={162} radiusX={7} radiusY={7} fill={eye} />
          <Ellipse x={cx - 30} y={160} radiusX={3} radiusY={2} fill="#FFFFFF" opacity={0.7} />
          <Ellipse x={cx + 34} y={160} radiusX={3} radiusY={2} fill="#FFFFFF" opacity={0.7} />

          {/* Lashes */}
          {[-32, 32].map((ox) => (
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

          {/* Blush */}
          {state.blush !== 'none' && (
            <>
              <Ellipse x={cx - 52} y={178} radiusX={18} radiusY={12} fill={BLUSH_C[state.blush]} />
              <Ellipse x={cx + 52} y={178} radiusX={18} radiusY={12} fill={BLUSH_C[state.blush]} />
            </>
          )}

          {/* Highlighter */}
          {state.highlighter !== 'none' && (
            <>
              <Ellipse x={cx - 48} y={168} radiusX={12} radiusY={8} fill={HI_C[state.highlighter]} />
              <Ellipse x={cx + 48} y={168} radiusX={12} radiusY={8} fill={HI_C[state.highlighter]} />
            </>
          )}

          {/* Lips */}
          <Ellipse
            x={cx}
            y={192}
            radiusX={22}
            radiusY={9}
            fill={LIP[state.lipstick] === 'transparent' ? '#D89090' : LIP[state.lipstick]}
            opacity={state.lipstick === 'none' ? 0.55 : 0.95}
          />

          {/* Растровая причёска (прозрачное «окно» под лицо) */}
          {useRasterHair && hairImg && (
            <KonvaImage
              image={hairImg}
              x={cx - rasterHairDims.w / 2}
              y={RASTER_HAIR_Y}
              width={rasterHairDims.w}
              height={rasterHairDims.h}
              listening={false}
            />
          )}

          {/* Hair front — вектор, если PNG нет */}
          {!useRasterHair && state.hairStyle !== 'pixie' && (
            <Group>
              <Ellipse x={cx - 55} y={125} radiusX={38} radiusY={48} fill={hair} />
              <Ellipse x={cx + 55} y={125} radiusX={38} radiusY={48} fill={hair} />
              {state.hairStyle === 'pony' && (
                <Ellipse x={cx} y={85} radiusX={22} radiusY={28} fill={hair} />
              )}
              {state.hairStyle === 'bun' && (
                <Ellipse x={cx} y={92} radiusX={34} radiusY={34} fill={hair} />
              )}
            </Group>
          )}
          {!useRasterHair && state.hairStyle === 'pixie' && (
            <Ellipse x={cx} y={128} radiusX={78} radiusY={40} fill={hair} />
          )}

          {/* Earrings */}
          {state.earrings !== 'none' && (
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
              {state.earrings === 'drops' && (
                <>
                  <Ellipse x={cx - rx - 6} y={186} radiusX={4} radiusY={10} fill="#E91E8C" opacity={0.8} />
                  <Ellipse x={cx + rx + 6} y={186} radiusX={4} radiusY={10} fill="#E91E8C" opacity={0.8} />
                </>
              )}
            </>
          )}

          {/* Shoes */}
          <Group y={H - 48}>
            <Ellipse
              x={cx - 38}
              y={18}
              radiusX={28}
              radiusY={12}
              fill={state.shoes.startsWith('heels') ? '#2A2020' : state.shoes === 'boots' ? '#4A3A38' : '#FFFFFF'}
              stroke="#DDD"
              strokeWidth={1}
            />
            <Ellipse
              x={cx + 38}
              y={18}
              radiusX={28}
              radiusY={12}
              fill={state.shoes.startsWith('heels') ? '#2A2020' : state.shoes === 'boots' ? '#4A3A38' : '#F8E8F2'}
              stroke="#DDD"
              strokeWidth={1}
            />
          </Group>

          {/* Bag */}
          {state.bag !== 'none' && (
            <Group x={cx + 100} y={240}>
              <Rect width={36} height={44} cornerRadius={6} fill="#E91E8C" opacity={0.85} />
              <Line points={[0, 0, 18, -18, 36, 0]} stroke="#9B1B5A" strokeWidth={3} lineCap="round" />
              {state.bag === 'clutch' && <Rect x={4} y={10} width={28} height={24} cornerRadius={4} fill="#F8B4D9" />}
            </Group>
          )}
        </Layer>
      </Stage>
    );
  }
);

export default BeautyAvatarCanvas;
