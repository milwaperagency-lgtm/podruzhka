import { useCallback, useMemo, useState } from 'react';
import type Konva from 'konva';
import type { AvatarState } from '@/types';
import {
  CASUAL_BOTTOMS,
  CASUAL_DRESSES,
  CASUAL_JACKETS,
  CASUAL_JEWELRY,
  CASUAL_SHOES,
  CASUAL_TOPS,
  CASUAL_UNDERWEAR,
  PART_DECOR_FACE,
  PART_EARS,
  PART_EYEBROWS,
  PART_EYELASHES,
  PART_EYE_WHITE,
  PART_MOUTH,
  PART_NOSE,
  PART_PUPILS,
  HAIR_BANGS_OPTS,
  HAIR_SETS,
  HAIR_TONES,
  SKIN_TONES,
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
            <OptionRow label="Уши (контур)">
              <ChipSelect value={value.partEars} onChange={(v) => patch({ partEars: v })} options={PART_EARS} />
            </OptionRow>
            <OptionRow label="Макияж и декор кожи">
              <ChipSelect
                value={value.partDecorFace}
                onChange={(v) => patch({ partDecorFace: v })}
                options={PART_DECOR_FACE}
              />
            </OptionRow>
            <OptionRow label="Нос">
              <ChipSelect value={value.partNose} onChange={(v) => patch({ partNose: v })} options={PART_NOSE} />
            </OptionRow>
            <OptionRow label="База: тон кожи (под всеми слоями)">
              <ChipSelect value={value.skinTone} onChange={(v) => patch({ skinTone: v })} options={[...SKIN_TONES]} />
            </OptionRow>
          </div>
        );
      case 'eyes':
        return (
          <div className="space-y-4">
            <OptionRow label="Склера и форма глаза">
              <ChipSelect
                value={value.partEyeWhite}
                onChange={(v) => patch({ partEyeWhite: v })}
                options={PART_EYE_WHITE}
              />
            </OptionRow>
            <OptionRow label="Радужка и зрачок">
              <ChipSelect value={value.partPupil} onChange={(v) => patch({ partPupil: v })} options={PART_PUPILS} />
            </OptionRow>
            <OptionRow label="Брови">
              <ChipSelect
                value={value.partEyebrows}
                onChange={(v) => patch({ partEyebrows: v })}
                options={PART_EYEBROWS}
              />
            </OptionRow>
            <OptionRow label="Ресницы и линия роста">
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
          <OptionRow label="Губы и форма рта">
            <ChipSelect value={value.partMouth} onChange={(v) => patch({ partMouth: v })} options={PART_MOUTH} />
          </OptionRow>
        );
      case 'hair':
        return (
          <div className="space-y-4">
            <OptionRow label="Задняя часть причёски">
              <ChipSelect value={value.hairSet} onChange={(v) => patch({ hairSet: v })} options={HAIR_SETS} />
            </OptionRow>
            <OptionRow label="Оттенок прядей сзади">
              <ChipSelect value={value.hairTone} onChange={(v) => patch({ hairTone: v })} options={HAIR_TONES} />
            </OptionRow>
            <OptionRow label="Чёлка (перед лица)">
              <ChipSelect value={value.hairBangs} onChange={(v) => patch({ hairBangs: v })} options={HAIR_BANGS_OPTS} />
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
                    value.outfitMode === 'separate' ? 'btn-primary' : 'btn-secondary'
                  }`}
                  onClick={() => patch({ outfitMode: 'separate' })}
                >
                  Верх + низ
                </button>
                <button
                  type="button"
                  className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                    value.outfitMode === 'dress' ? 'btn-primary' : 'btn-secondary'
                  }`}
                  onClick={() => patch({ outfitMode: 'dress' })}
                >
                  Платье
                </button>
              </div>
            </OptionRow>
            {value.outfitMode === 'separate' ? (
              <>
                <OptionRow label="Низ (юбка / брюки)">
                  <ChipSelect
                    value={value.casualBottom}
                    onChange={(v) => patch({ casualBottom: v })}
                    options={CASUAL_BOTTOMS}
                  />
                </OptionRow>
                <OptionRow label="Верх (топ / рубашка)">
                  <ChipSelect value={value.casualTop} onChange={(v) => patch({ casualTop: v })} options={CASUAL_TOPS} />
                </OptionRow>
              </>
            ) : (
              <OptionRow label="Платье">
                <ChipSelect
                  value={value.casualDress}
                  onChange={(v) => patch({ casualDress: v })}
                  options={CASUAL_DRESSES}
                />
              </OptionRow>
            )}
            <OptionRow label="Жакет">
              <ChipSelect
                value={value.casualJacket}
                onChange={(v) => patch({ casualJacket: v })}
                options={CASUAL_JACKETS}
              />
            </OptionRow>
            <OptionRow label="Нижнее бельё">
              <ChipSelect
                value={value.casualUnderwear}
                onChange={(v) => patch({ casualUnderwear: v })}
                options={CASUAL_UNDERWEAR}
              />
            </OptionRow>
          </div>
        );
      case 'shoes':
        return (
          <OptionRow label="Обувь">
            <ChipSelect value={value.casualShoes} onChange={(v) => patch({ casualShoes: v })} options={CASUAL_SHOES} />
          </OptionRow>
        );
      case 'accessories':
        return (
          <OptionRow label="Украшение">
            <ChipSelect
              value={value.casualJewelry}
              onChange={(v) => patch({ casualJewelry: v })}
              options={CASUAL_JEWELRY}
            />
          </OptionRow>
        );
      default:
        return null;
    }
  }, [patch, tab, value]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div
        className="glass-panel mx-auto w-full max-w-[340px] overflow-visible p-2 transition-all duration-300 ease-out"
        style={{ aspectRatio: `${320}/${420}` }}
      >
        <div className="h-full w-full min-h-0">
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
