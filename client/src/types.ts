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
  if (raw === 'light' || raw === 'porcelain') return 'light';
  if (raw === 'deep' || raw === 'tan') return 'deep';
  return 'medium';
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
  return {
    partEars: typeof o.partEars === 'string' ? o.partEars : d.partEars,
    partDecorFace: typeof o.partDecorFace === 'string' ? o.partDecorFace : d.partDecorFace,
    partEyebrows: typeof o.partEyebrows === 'string' ? o.partEyebrows : d.partEyebrows,
    partEyelashes: typeof o.partEyelashes === 'string' ? o.partEyelashes : d.partEyelashes,
    partEyeWhite: typeof o.partEyeWhite === 'string' ? o.partEyeWhite : d.partEyeWhite,
    partPupil: typeof o.partPupil === 'string' ? o.partPupil : d.partPupil,
    partNose: typeof o.partNose === 'string' ? o.partNose : d.partNose,
    partMouth: typeof o.partMouth === 'string' ? o.partMouth : d.partMouth,
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

  return {
    ...d,
    ...face,
    hairSet: typeof o.hairSet === 'string' ? o.hairSet : d.hairSet,
    hairTone,
    hairBangs: typeof o.hairBangs === 'string' ? o.hairBangs : d.hairBangs,
    outfitMode,
    casualTop: typeof o.casualTop === 'string' ? o.casualTop : d.casualTop,
    casualBottom: typeof o.casualBottom === 'string' ? o.casualBottom : d.casualBottom,
    casualDress: typeof o.casualDress === 'string' ? o.casualDress : d.casualDress,
    casualJacket: typeof o.casualJacket === 'string' ? o.casualJacket : d.casualJacket,
    casualShoes: typeof o.casualShoes === 'string' ? o.casualShoes : d.casualShoes,
    casualUnderwear: typeof o.casualUnderwear === 'string' ? o.casualUnderwear : d.casualUnderwear,
    casualJewelry: typeof o.casualJewelry === 'string' ? o.casualJewelry : d.casualJewelry,
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
