import crypto from 'node:crypto';
import { PromoCodeModel } from '../models/PromoCode.js';
import { PROMO_AT_LEVEL } from '../constants/levels.js';

function randomSuffix(): string {
  return crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 4);
}

export async function createPromoForLevel(
  telegramId: number,
  level: number
): Promise<{ code: string; discount: number } | null> {
  const discount = PROMO_AT_LEVEL[level];
  if (!discount) return null;

  for (let i = 0; i < 8; i++) {
    const code = `PODRYGKA-${randomSuffix()}`;
    try {
      await PromoCodeModel.create({
        code,
        discount,
        user_id: telegramId,
        source_level: level,
      });
      return { code, discount };
    } catch {
      /* duplicate code */
    }
  }
  throw new Error('promo_generation_failed');
}
