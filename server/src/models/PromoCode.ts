import mongoose from 'mongoose';

const PromoCodeSchema = new mongoose.Schema(
  {
    /** 0 = пул админ-кодов; иначе Telegram user id */
    user_id: { type: Number, required: true, default: 0, index: true },
    code: { type: String, required: true },
    discount: { type: Number, required: true },
    used: { type: Boolean, default: false },
    source_level: { type: Number },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

PromoCodeSchema.index({ user_id: 1, code: 1 }, { unique: true });

export const PromoCodeModel = mongoose.model('PromoCode', PromoCodeSchema);
