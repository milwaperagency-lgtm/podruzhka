import { PromoCodeModel } from '../models/PromoCode.js';

/** Фиксированные промокоды за этапы (один набор на пользователя). */
export const MILESTONE_PROMO: Record<number, { code: string; discount: number }> = {
  5: { code: 'FREE5', discount: 5 },
  10: { code: 'FREE10', discount: 10 },
  15: { code: 'FREE15', discount: 15 },
  20: { code: 'FREE20', discount: 20 },
  25: { code: 'FREE25', discount: 25 },
};

export async function createPromoForLevel(
  telegramId: number,
  level: number
): Promise<{ code: string; discount: number } | null> {
  const m = MILESTONE_PROMO[level];
  if (!m) return null;

  const existing = await PromoCodeModel.findOne({ user_id: telegramId, code: m.code }).lean();
  if (existing) {
    return { code: m.code, discount: m.discount };
  }

  await PromoCodeModel.create({
    code: m.code,
    discount: m.discount,
    user_id: telegramId,
    source_level: level,
    used: false,
  });
  return { code: m.code, discount: m.discount };
}
