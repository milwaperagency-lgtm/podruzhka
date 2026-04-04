import mongoose from 'mongoose';

const PromoCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    discount: { type: Number, required: true },
    user_id: { type: Number, required: false, index: true },
    used: { type: Boolean, default: false },
    source_level: { type: Number },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

export const PromoCodeModel = mongoose.model('PromoCode', PromoCodeSchema);
