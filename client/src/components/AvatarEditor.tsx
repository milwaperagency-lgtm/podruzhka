import { useCallback, useMemo, useState } from 'react';
import type Konva from 'konva';
import type { AvatarState } from '@/types';
import {
  BAGS,
  DRESSES,
  EARRINGS,
  HAIR_COLORS,
  HAIR_STYLES,
  JACKETS,
  PART_DECOR_FACE,
  PART_EARS,
  PART_EYEBROWS,
  PART_EYELASHES,
  PART_EYE_WHITE,
  PART_MOUTH,
  PART_NOSE,
  PART_PUPILS,
  SHOES,
  SKIN_TONES,
  TOPS,
} from '@/data/avatarOptions';
import BeautyAvatarCanvas from '@/components/avatar/BeautyAvatarCanvas';

type Tab = 'face' | 'eyes' | 'mouth' | 'hair' | 'outfit' | 'shoes' | 'accessories';

const tabs: { id: Tab; label: string }[] = [
  { id: 'face', label: 'Лицо' },
  { id: 'eyes', label: 'Глаза' },
  { id: 'mouth', label: 'Губы' },
  { id: 'hair', label: 'Волосы' },
  { id: 'outfit', label: 'Наряд' },
  { id: 'shoes', label: 'Обувь' },
  { id: 'accessories', label: 'Аксессуары' },
];

function OptionRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-podrygka-deep/60">{label}</p>
      {children}
    </div>
  );
}

function ChipSelect<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
            value === o.id
              ? 'bg-gradient-to-r from-podrygka-pink to-podrygka-deep text-white shadow-card'
              : 'bg-white/90 text-podrygka-deep ring-1 ring-podrygka-rose/40 hover:ring-podrygka-pink/50'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export interface AvatarEditorProps {
  value: AvatarState;
  onChange: (next: AvatarState) => void;
  previewRef?: React.RefObject<Konva.Stage>;
}

export default function AvatarEditor({ value, onChange, previewRef }: AvatarEditorProps) {
  const [tab, setTab] = useState<Tab>('face');

  const patch = useCallback(
    (p: Partial<AvatarState>) => {
      onChange({ ...value, ...p });
    },
    [onChange, value]
  );

  const panel = useMemo(() => {
    switch (tab) {
      case 'face':
        return (
          <div className="space-y-4">
            <OptionRow label="Уши">
              <ChipSelect value={value.partEars} onChange={(v) => patch({ partEars: v })} options={PART_EARS} />
            </OptionRow>
            <OptionRow label="Декор / макияж кожи">
              <ChipSelect
                value={value.partDecorFace}
                onChange={(v) => patch({ partDecorFace: v })}
                options={PART_DECOR_FACE}
              />
            </OptionRow>
            <OptionRow label="Нос">
              <ChipSelect value={value.partNose} onChange={(v) => patch({ partNose: v })} options={PART_NOSE} />
            </OptionRow>
            <OptionRow label="Тон кожи">
              <ChipSelect value={value.skinTone} onChange={(v) => patch({ skinTone: v })} options={SKIN_TONES} />
            </OptionRow>
          </div>
        );
      case 'eyes':
        return (
          <div className="space-y-4">
            <OptionRow label="Белок глаза">
              <ChipSelect
                value={value.partEyeWhite}
                onChange={(v) => patch({ partEyeWhite: v })}
                options={PART_EYE_WHITE}
              />
            </OptionRow>
            <OptionRow label="Зрачок">
              <ChipSelect value={value.partPupil} onChange={(v) => patch({ partPupil: v })} options={PART_PUPILS} />
            </OptionRow>
            <OptionRow label="Брови">
              <ChipSelect
                value={value.partEyebrows}
                onChange={(v) => patch({ partEyebrows: v })}
                options={PART_EYEBROWS}
              />
            </OptionRow>
            <OptionRow label="Ресницы">
              <ChipSelect
                value={value.partEyelashes}
                onChange={(v) => patch({ partEyelashes: v })}
                options={PART_EYELASHES}
              />
            </OptionRow>
          </div>
        );
      case 'mouth':
        return (
          <OptionRow label="Форма губ">
            <ChipSelect value={value.partMouth} onChange={(v) => patch({ partMouth: v })} options={PART_MOUTH} />
          </OptionRow>
        );
      case 'hair':
        return (
          <div className="space-y-4">
            <OptionRow label="Причёска">
              <ChipSelect value={value.hairStyle} onChange={(v) => patch({ hairStyle: v })} options={HAIR_STYLES} />
            </OptionRow>
            <OptionRow label="Цвет волос">
              <ChipSelect value={value.hairColor} onChange={(v) => patch({ hairColor: v })} options={HAIR_COLORS} />
            </OptionRow>
          </div>
        );
      case 'outfit':
        return (
          <div className="space-y-4">
            <OptionRow label="Режим">
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                    value.outfitMode === 'top' ? 'btn-primary' : 'btn-secondary'
                  }`}
                  onClick={() => patch({ outfitMode: 'top', dress: 'none' })}
                >
                  Топ
                </button>
                <button
                  type="button"
                  className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                    value.outfitMode === 'dress' ? 'btn-primary' : 'btn-secondary'
                  }`}
                  onClick={() =>
                    patch({
                      outfitMode: 'dress',
                      dress: value.dress === 'none' ? 'midi_floral' : value.dress,
                    })
                  }
                >
                  Платье
                </button>
              </div>
            </OptionRow>
            {value.outfitMode === 'top' ? (
              <OptionRow label="Верх">
                <ChipSelect value={value.top} onChange={(v) => patch({ top: v })} options={TOPS} />
              </OptionRow>
            ) : (
              <OptionRow label="Платье">
                <ChipSelect value={value.dress} onChange={(v) => patch({ dress: v })} options={DRESSES} />
              </OptionRow>
            )}
            <OptionRow label="Жакет / накидка">
              <ChipSelect value={value.jacket} onChange={(v) => patch({ jacket: v })} options={JACKETS} />
            </OptionRow>
          </div>
        );
      case 'shoes':
        return (
          <OptionRow label="Обувь">
            <ChipSelect value={value.shoes} onChange={(v) => patch({ shoes: v })} options={SHOES} />
          </OptionRow>
        );
      case 'accessories':
        return (
          <div className="space-y-4">
            <OptionRow label="Серьги">
              <ChipSelect value={value.earrings} onChange={(v) => patch({ earrings: v })} options={EARRINGS} />
            </OptionRow>
            <OptionRow label="Сумка">
              <ChipSelect value={value.bag} onChange={(v) => patch({ bag: v })} options={BAGS} />
            </OptionRow>
          </div>
        );
      default:
        return null;
    }
  }, [patch, tab, value]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div
        className="glass-panel mx-auto w-full max-w-[340px] overflow-hidden p-2 transition-all duration-300 ease-out"
        style={{ aspectRatio: `${320}/${420}` }}
      >
        <div className="h-full w-full origin-top scale-[0.98] transition-transform duration-300 ease-out">
          <BeautyAvatarCanvas ref={previewRef} state={value} />
        </div>
      </div>

      <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t.id
                ? 'bg-podrygka-deep text-white shadow-card'
                : 'bg-white/80 text-podrygka-deep ring-1 ring-podrygka-rose/40'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="glass-panel min-h-[200px] flex-1 overflow-y-auto p-4">{panel}</div>
    </div>
  );
}
