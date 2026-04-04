import type { AvatarState } from '../constants/avatar.js';
import { DEFAULT_AVATAR, diffCount, hasAnyMakeup, makeupLayerCount } from '../constants/avatar.js';

/** Подстройте под арт набора: индексы файлов shoes/N.webp */
const HEELS = new Set(['7', '8', '9', '10']);
const SNEAKERS = new Set(['1', '2', '3', '4', '5']);
/** «Casual» верх для уровня 4 */
const CASUAL_TOPS_CASUAL = new Set(['1', '2', '3', '4', '5', '6']);

const BOLD_MOUTH = ['11', '12', '13', '14'];
const RED_MOUTH = ['12', '13', '14'];
const NUDE_MOUTH = ['1', '2', '3'];

export function validateLevelTask(levelId: number, s: AvatarState): { ok: true } | { ok: false; reason: string } {
  switch (levelId) {
    case 1:
      return diffCount(s, DEFAULT_AVATAR) >= 3
        ? { ok: true }
        : { ok: false, reason: 'Измените минимум 3 элемента аватара.' };
    case 2:
      return hasAnyMakeup(s)
        ? { ok: true }
        : { ok: false, reason: 'Добавьте макияж (декор лица, ресницы, брови или другой рот).' };
    case 3:
      if (s.outfitMode !== 'dress') return { ok: false, reason: 'Выберите режим «Платье».' };
      if (!HEELS.has(s.casualShoes)) return { ok: false, reason: 'Нужны каблуки (обувь 7–10).' };
      if (!BOLD_MOUTH.includes(s.partMouth)) return { ok: false, reason: 'Выберите более выразительные губы.' };
      return { ok: true };
    case 4:
      if (s.outfitMode !== 'separate') return { ok: false, reason: 'Выберите режим «Верх + низ».' };
      if (!CASUAL_TOPS_CASUAL.has(s.casualTop)) return { ok: false, reason: 'Выберите casual-верх (1–6).' };
      if (!SNEAKERS.has(s.casualShoes)) return { ok: false, reason: 'Нужны кроссовки (1–5).' };
      return { ok: true };
    case 5: {
      if (!hasAnyMakeup(s)) return { ok: false, reason: 'Добавьте макияж.' };
      const outfitOk =
        s.outfitMode === 'dress' ||
        (s.casualTop !== '1' && s.outfitMode === 'separate') ||
        s.casualJacket !== 'none';
      if (!outfitOk) return { ok: false, reason: 'Соберите наряд (платье, не базовый верх или жакет).' };
      if (s.casualJewelry === 'none') return { ok: false, reason: 'Добавьте украшение.' };
      return { ok: true };
    }
    case 6: {
      const pastel =
        s.partPupil.includes('b') ||
        s.partDecorFace !== 'none' ||
        ['4', '5', '6'].includes(s.partMouth);
      return pastel ? { ok: true } : { ok: false, reason: 'Используйте розовые/пастельные акценты (зрачок b/c, декор).' };
    }
    case 7:
      return s.hairSet !== DEFAULT_AVATAR.hairSet ||
        s.hairBangs !== DEFAULT_AVATAR.hairBangs ||
        s.hairTone !== DEFAULT_AVATAR.hairTone
        ? { ok: true }
        : { ok: false, reason: 'Смените причёску, чёлку и/или вариант a/b.' };
    case 8:
      return s.partPupil !== '1a' || s.partEyelashes !== '1' || s.partEyeWhite !== '1'
        ? { ok: true }
        : { ok: false, reason: 'Измените форму глаз, зрачок или ресницы.' };
    case 9:
      return s.casualJacket !== 'none' ? { ok: true } : { ok: false, reason: 'Наденьте жакет.' };
    case 10:
      return s.casualJewelry !== 'none' && s.casualJacket !== 'none'
        ? { ok: true }
        : { ok: false, reason: 'Нужны и украшение, и жакет.' };
    case 11:
      return s.casualTop === '1' && s.casualShoes === '1' && NUDE_MOUTH.includes(s.partMouth)
        ? { ok: true }
        : { ok: false, reason: 'Нейтральный look: верх 1, обувь 1, спокойные губы (1–3).' };
    case 12:
      return s.partDecorFace !== 'none' && s.partEyelashes !== '1'
        ? { ok: true }
        : { ok: false, reason: 'Добавьте декор лица и не базовые ресницы.' };
    case 13:
      return s.outfitMode === 'dress' && HEELS.has(s.casualShoes) && s.partDecorFace !== 'none'
        ? { ok: true }
        : { ok: false, reason: 'Платье + каблуки + декор лица.' };
    case 14:
      return RED_MOUTH.includes(s.partMouth) && (s.partDecorFace === 'none' || s.partDecorFace === '1')
        ? { ok: true }
        : { ok: false, reason: 'Яркие губы и без тяжёлого декора (или минимальный).' };
    case 15:
      return ['3a', '3b', '3c', '4a', '4b', '4c'].includes(s.partPupil) && NUDE_MOUTH.includes(s.partMouth)
        ? { ok: true }
        : { ok: false, reason: 'Акцент на глаза: выразительный зрачок + нейтральные губы.' };
    case 16:
      return SNEAKERS.has(s.casualShoes) && s.outfitMode === 'separate' && hasAnyMakeup(s)
        ? { ok: true }
        : { ok: false, reason: 'Кроссовки + верх/низ + лёгкий макияж.' };
    case 17: {
      const glam =
        s.outfitMode === 'dress' &&
        HEELS.has(s.casualShoes) &&
        makeupLayerCount(s) >= 3 &&
        hasAnyMakeup(s);
      return glam ? { ok: true } : { ok: false, reason: 'Платье, каблуки и насыщенный макияж (3+ отличия).' };
    }
    case 18:
      return s.casualJewelry === 'none' && hasAnyMakeup(s) && (s.outfitMode === 'dress' || s.casualJacket !== 'none')
        ? { ok: true }
        : { ok: false, reason: 'Без украшений, но с макияжем и нарядом (платье или жакет).' };
    case 19:
      return diffCount(s, DEFAULT_AVATAR) >= 8
        ? { ok: true }
        : { ok: false, reason: 'Активируйте 8+ отличий от базового образа.' };
    case 20: {
      const full =
        hasAnyMakeup(s) &&
        s.outfitMode === 'dress' &&
        HEELS.has(s.casualShoes) &&
        s.casualJewelry !== 'none' &&
        s.casualJacket !== 'none' &&
        makeupLayerCount(s) >= 3;
      return full ? { ok: true } : { ok: false, reason: 'Финальный look: платье, каблуки, макияж, жакет и украшение.' };
    }
    default:
      return { ok: false, reason: 'Неизвестный уровень.' };
  }
}
