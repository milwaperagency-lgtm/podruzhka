export interface AvatarState {
  faceShape: string;
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  lashes: string;
  lipstick: string;
  eyeshadow: string;
  blush: string;
  highlighter: string;
  outfitMode: 'top' | 'dress';
  top: string;
  dress: string;
  jacket: string;
  shoes: string;
  earrings: string;
  bag: string;
}

export const defaultAvatarState = (): AvatarState => ({
  faceShape: 'oval',
  skinTone: 'medium',
  hairStyle: 'long_wavy',
  hairColor: 'chestnut',
  eyeColor: 'brown',
  lashes: 'natural',
  lipstick: 'none',
  eyeshadow: 'none',
  blush: 'none',
  highlighter: 'none',
  outfitMode: 'top',
  top: 'tee_white',
  dress: 'none',
  jacket: 'none',
  shoes: 'sneakers_white',
  earrings: 'none',
  bag: 'none',
});

export interface UserProfile {
  telegram_id: number;
  username?: string;
  /** Next level to complete (1–20) */
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
