import {
  CASUAL_BOTTOM_IDS,
  CASUAL_DRESS_IDS,
  CASUAL_JACKET_IDS,
  CASUAL_JEWELRY_IDS,
  CASUAL_SHOE_IDS,
  CASUAL_TOP_IDS,
  CASUAL_UNDERWEAR_IDS,
  HAIR_BANG_IDS,
  HAIR_SET_IDS,
  PART_DECOR_FACE_IDS,
  PART_EAR_IDS,
  PART_EYEBROW_IDS,
  PART_EYELASH_IDS,
  PART_EYE_WHITE_IDS,
  PART_MOUTH_IDS,
  PART_NOSE_IDS,
  pickFrom,
  pickPupil,
  pickSkinTone,
} from '@/data/assetIds';

export interface AvatarState {
  partEars: string;
  partDecorFace: string;
  partEyebrows: string;
  partEyelashes: string;
  partEyeWhite: string;
  partPupil: string;
  partNose: string;
  partMouth: string;
  skinTone: string;
  /** Набор «feminine casual»: причёска 1–10, вариант задних волос a/b */
  hairSet: string;
  hairTone: 'a' | 'b';
  hairBangs: string;
  /** Платье целиком или верх + низ */
  outfitMode: 'dress' | 'separate';
  casualTop: string;
  casualBottom: string;
  /** В режиме платья — номер 1–10; в режиме separate не показывается */
  casualDress: string;
  casualJacket: string;
  casualShoes: string;
  casualUnderwear: string;
  casualJewelry: string;
}

export const defaultAvatarState = (): AvatarState => ({
  partEars: 'none',
  partDecorFace: 'none',
  partEyebrows: '1',
  partEyelashes: '1',
  partEyeWhite: '1',
  partPupil: '1a',
  partNose: '1',
  partMouth: '1',
  skinTone: 'light',
  hairSet: '1',
  hairTone: 'a',
  hairBangs: '1',
  outfitMode: 'separate',
  casualTop: '1',
  casualBottom: '1',
  casualDress: '1',
  casualJacket: 'none',
  casualShoes: '1',
  casualUnderwear: '1',
  casualJewelry: 'none',
});

/** Три базовых тона; старые porcelain/tan маппятся сюда. */
export function normalizeSkinToneId(raw: string): 'light' | 'medium' | 'deep' {
  return pickSkinTone(raw);
}

function extractFace(o: Record<string, unknown>, d: AvatarState): Pick<
  AvatarState,
  | 'partEars'
  | 'partDecorFace'
  | 'partEyebrows'
  | 'partEyelashes'
  | 'partEyeWhite'
  | 'partPupil'
  | 'partNose'
  | 'partMouth'
  | 'skinTone'
> {
  const st = typeof o.skinTone === 'string' ? o.skinTone : d.skinTone;
  const pe = typeof o.partEars === 'string' ? o.partEars : d.partEars;
  const pdf = typeof o.partDecorFace === 'string' ? o.partDecorFace : d.partDecorFace;
  const pb = typeof o.partEyebrows === 'string' ? o.partEyebrows : d.partEyebrows;
  const pl = typeof o.partEyelashes === 'string' ? o.partEyelashes : d.partEyelashes;
  const pew = typeof o.partEyeWhite === 'string' ? o.partEyeWhite : d.partEyeWhite;
  const pp = typeof o.partPupil === 'string' ? o.partPupil : d.partPupil;
  const pn = typeof o.partNose === 'string' ? o.partNose : d.partNose;
  const pm = typeof o.partMouth === 'string' ? o.partMouth : d.partMouth;
  return {
    partEars: pickFrom(PART_EAR_IDS, pe, 'none'),
    partDecorFace: pickFrom(PART_DECOR_FACE_IDS, pdf, 'none'),
    partEyebrows: pickFrom(PART_EYEBROW_IDS, pb, '1'),
    partEyelashes: pickFrom(PART_EYELASH_IDS, pl, '1'),
    partEyeWhite: pickFrom(PART_EYE_WHITE_IDS, pew, '1'),
    partPupil: pickPupil(pp),
    partNose: pickFrom(PART_NOSE_IDS, pn, '1'),
    partMouth: pickFrom(PART_MOUTH_IDS, pm, '1'),
    skinTone: normalizeSkinToneId(st),
  };
}

export function normalizeAvatarState(raw: Partial<AvatarState> | Record<string, unknown> | null | undefined): AvatarState {
  const d = defaultAvatarState();
  if (!raw || typeof raw !== 'object') return d;
  const o = raw as Record<string, unknown>;

  const face = extractFace(o, d);

  if (o.partMouth == null) {
    return { ...d, ...face };
  }

  if (typeof o.casualTop !== 'string') {
    return { ...d, ...face };
  }

  const hairTone: 'a' | 'b' = o.hairTone === 'b' ? 'b' : 'a';
  const outfitMode: 'dress' | 'separate' =
    o.outfitMode === 'dress' || o.outfitMode === 'separate' ? o.outfitMode : d.outfitMode;

  const hs = typeof o.hairSet === 'string' ? o.hairSet : d.hairSet;
  const hb = typeof o.hairBangs === 'string' ? o.hairBangs : d.hairBangs;
  const ct = typeof o.casualTop === 'string' ? o.casualTop : d.casualTop;
  const cb = typeof o.casualBottom === 'string' ? o.casualBottom : d.casualBottom;
  const cd = typeof o.casualDress === 'string' ? o.casualDress : d.casualDress;
  const cj = typeof o.casualJacket === 'string' ? o.casualJacket : d.casualJacket;
  const cs = typeof o.casualShoes === 'string' ? o.casualShoes : d.casualShoes;
  const cu = typeof o.casualUnderwear === 'string' ? o.casualUnderwear : d.casualUnderwear;
  const cjew = typeof o.casualJewelry === 'string' ? o.casualJewelry : d.casualJewelry;

  return {
    ...d,
    ...face,
    hairSet: pickFrom(HAIR_SET_IDS, hs, '1'),
    hairTone,
    hairBangs: pickFrom(HAIR_BANG_IDS, hb, '1'),
    outfitMode,
    casualTop: pickFrom(CASUAL_TOP_IDS, ct, '1'),
    casualBottom: pickFrom(CASUAL_BOTTOM_IDS, cb, '1'),
    casualDress: pickFrom(CASUAL_DRESS_IDS, cd, '1'),
    casualJacket: pickFrom(CASUAL_JACKET_IDS, cj, 'none'),
    casualShoes: pickFrom(CASUAL_SHOE_IDS, cs, '1'),
    casualUnderwear: pickFrom(CASUAL_UNDERWEAR_IDS, cu, '1'),
    casualJewelry: pickFrom(CASUAL_JEWELRY_IDS, cjew, 'none'),
  };
}

export interface UserProfile {
  telegram_id: number;
  username?: string;
  level: number;
  max_completed_level: number;
  points: number;
  created_avatar: AvatarState;
  onboarding_complete: boolean;
}

export interface PromoReward {
  code: string;
  discount: number;
  created_at: string;
  used: boolean;
}

export interface LevelDef {
  id: number;
  title: string;
  description: string;
  points: number;
}
