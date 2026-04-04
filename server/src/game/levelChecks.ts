import type { AvatarState } from '../constants/avatar.js';
import { DEFAULT_AVATAR, diffCount, hasAnyMakeup, makeupLayerCount } from '../constants/avatar.js';

/** Яркие варианты рта (условно «помада»). */
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
      if (s.dress === 'none') return { ok: false, reason: 'Выберите платье.' };
      if (s.shoes !== 'heels_black' && s.shoes !== 'heels_nude') return { ok: false, reason: 'Нужны каблуки.' };
      if (!BOLD_MOUTH.includes(s.partMouth)) return { ok: false, reason: 'Выберите более выразительные губы.' };
      return { ok: true };
    case 4:
      if (s.outfitMode !== 'top') return { ok: false, reason: 'Выберите режим «Топ» (без платья).' };
      if (!['tee_white', 'tee_blush', 'hoodie', 'crop_top'].includes(s.top))
        return { ok: false, reason: 'Выберите casual-топ.' };
      if (s.shoes !== 'sneakers_white' && s.shoes !== 'sneakers_pastel')
        return { ok: false, reason: 'Нужны кроссовки.' };
      return { ok: true };
    case 5: {
      if (!hasAnyMakeup(s)) return { ok: false, reason: 'Добавьте макияж.' };
      const outfitOk =
        s.dress !== 'none' || (s.top !== 'tee_white' && s.outfitMode === 'top') || s.jacket !== 'none';
      if (!outfitOk) return { ok: false, reason: 'Соберите наряд (платье, не базовый топ или жакет).' };
      if (s.earrings === 'none' && s.bag === 'none')
        return { ok: false, reason: 'Добавьте аксессуар (серьги или сумку).' };
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
      return s.hairStyle !== DEFAULT_AVATAR.hairStyle || s.hairColor !== DEFAULT_AVATAR.hairColor
        ? { ok: true }
        : { ok: false, reason: 'Смените причёску и/или цвет волос.' };
    case 8:
      return s.partPupil !== '1a' || s.partEyelashes !== '1' || s.partEyeWhite !== '1'
        ? { ok: true }
        : { ok: false, reason: 'Измените форму глаз, зрачок или ресницы.' };
    case 9:
      return s.jacket !== 'none' ? { ok: true } : { ok: false, reason: 'Наденьте жакет/накидку.' };
    case 10:
      return s.bag !== 'none' && s.earrings !== 'none'
        ? { ok: true }
        : { ok: false, reason: 'Нужны и серьги, и сумка.' };
    case 11:
      return s.top === 'tee_white' && s.shoes === 'sneakers_white' && NUDE_MOUTH.includes(s.partMouth)
        ? { ok: true }
        : { ok: false, reason: 'Нейтральный look: белый топ, белые кроссовки, спокойные губы (1–3).' };
    case 12:
      return s.partDecorFace !== 'none' && s.partEyelashes !== '1'
        ? { ok: true }
        : { ok: false, reason: 'Добавьте декор лица и не базовые ресницы.' };
    case 13:
      return s.dress !== 'none' && s.shoes.startsWith('heels') && s.partDecorFace !== 'none'
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
      return (s.shoes === 'sneakers_white' || s.shoes === 'sneakers_pastel') &&
        s.outfitMode === 'top' &&
        hasAnyMakeup(s)
        ? { ok: true }
        : { ok: false, reason: 'Кроссовки + топ + лёгкий макияж.' };
    case 17: {
      const glam =
        s.dress !== 'none' &&
        s.shoes.startsWith('heels') &&
        makeupLayerCount(s) >= 3 &&
        hasAnyMakeup(s);
      return glam ? { ok: true } : { ok: false, reason: 'Платье, каблуки и насыщенный макияж (3+ отличия).' };
    }
    case 18:
      return s.earrings === 'none' && s.bag === 'none' && hasAnyMakeup(s) && (s.dress !== 'none' || s.jacket !== 'none')
        ? { ok: true }
        : { ok: false, reason: 'Без сумки и серёг, но с макияжем и нарядом.' };
    case 19:
      return diffCount(s, DEFAULT_AVATAR) >= 8
        ? { ok: true }
        : { ok: false, reason: 'Активируйте 8+ отличий от базового образа.' };
    case 20: {
      const full =
        hasAnyMakeup(s) &&
        s.dress !== 'none' &&
        s.shoes.startsWith('heels') &&
        s.earrings !== 'none' &&
        s.bag !== 'none' &&
        makeupLayerCount(s) >= 3;
      return full ? { ok: true } : { ok: false, reason: 'Финальный look: платье, каблуки, макияж, серьги и сумка.' };
    }
    default:
      return { ok: false, reason: 'Неизвестный уровень.' };
  }
}
