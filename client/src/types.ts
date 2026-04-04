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
  hairStyle: string;
  hairColor: string;
  outfitMode: 'top' | 'dress';
  top: string;
  dress: string;
  jacket: string;
  shoes: string;
  earrings: string;
  bag: string;
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
  skinTone: 'medium',
  hairStyle: 'long_wavy',
  hairColor: 'chestnut',
  outfitMode: 'top',
  top: 'tee_white',
  dress: 'none',
  jacket: 'none',
  shoes: 'sneakers_white',
  earrings: 'none',
  bag: 'none',
});

export function normalizeAvatarState(raw: Partial<AvatarState> | Record<string, unknown> | null | undefined): AvatarState {
  const d = defaultAvatarState();
  if (!raw || typeof raw !== 'object') return d;
  const o = raw as Record<string, unknown>;
  if (o.partMouth == null) {
    return {
      ...d,
      skinTone: typeof o.skinTone === 'string' ? o.skinTone : d.skinTone,
      hairStyle: typeof o.hairStyle === 'string' ? o.hairStyle : d.hairStyle,
      hairColor: typeof o.hairColor === 'string' ? o.hairColor : d.hairColor,
      outfitMode: o.outfitMode === 'dress' || o.outfitMode === 'top' ? o.outfitMode : d.outfitMode,
      top: typeof o.top === 'string' ? o.top : d.top,
      dress: typeof o.dress === 'string' ? o.dress : d.dress,
      jacket: typeof o.jacket === 'string' ? o.jacket : d.jacket,
      shoes: typeof o.shoes === 'string' ? o.shoes : d.shoes,
      earrings: typeof o.earrings === 'string' ? o.earrings : d.earrings,
      bag: typeof o.bag === 'string' ? o.bag : d.bag,
    };
  }
  return {
    ...d,
    partEars: typeof o.partEars === 'string' ? o.partEars : d.partEars,
    partDecorFace: typeof o.partDecorFace === 'string' ? o.partDecorFace : d.partDecorFace,
    partEyebrows: typeof o.partEyebrows === 'string' ? o.partEyebrows : d.partEyebrows,
    partEyelashes: typeof o.partEyelashes === 'string' ? o.partEyelashes : d.partEyelashes,
    partEyeWhite: typeof o.partEyeWhite === 'string' ? o.partEyeWhite : d.partEyeWhite,
    partPupil: typeof o.partPupil === 'string' ? o.partPupil : d.partPupil,
    partNose: typeof o.partNose === 'string' ? o.partNose : d.partNose,
    partMouth: typeof o.partMouth === 'string' ? o.partMouth : d.partMouth,
    skinTone: typeof o.skinTone === 'string' ? o.skinTone : d.skinTone,
    hairStyle: typeof o.hairStyle === 'string' ? o.hairStyle : d.hairStyle,
    hairColor: typeof o.hairColor === 'string' ? o.hairColor : d.hairColor,
    outfitMode: o.outfitMode === 'dress' || o.outfitMode === 'top' ? o.outfitMode : d.outfitMode,
    top: typeof o.top === 'string' ? o.top : d.top,
    dress: typeof o.dress === 'string' ? o.dress : d.dress,
    jacket: typeof o.jacket === 'string' ? o.jacket : d.jacket,
    shoes: typeof o.shoes === 'string' ? o.shoes : d.shoes,
    earrings: typeof o.earrings === 'string' ? o.earrings : d.earrings,
    bag: typeof o.bag === 'string' ? o.bag : d.bag,
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
