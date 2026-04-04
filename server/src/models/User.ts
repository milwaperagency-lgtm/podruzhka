import mongoose from 'mongoose';
import type { AvatarState } from '../constants/avatar.js';
import { DEFAULT_AVATAR } from '../constants/avatar.js';

const AvatarSchema = new mongoose.Schema<AvatarState>(
  {
    faceShape: String,
    skinTone: String,
    hairStyle: String,
    hairColor: String,
    eyeColor: String,
    lashes: String,
    lipstick: String,
    eyeshadow: String,
    blush: String,
    highlighter: String,
    outfitMode: String,
    top: String,
    dress: String,
    jacket: String,
    shoes: String,
    earrings: String,
    bag: String,
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    telegram_id: { type: Number, required: true, unique: true, index: true },
    username: { type: String },
    max_completed_level: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    created_avatar: { type: AvatarSchema, default: () => ({ ...DEFAULT_AVATAR }) },
    onboarding_complete: { type: Boolean, default: false },
    subscription_ok: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type UserDoc = mongoose.InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };
export const UserModel = mongoose.model('User', UserSchema);
