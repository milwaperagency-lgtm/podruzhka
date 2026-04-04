import type { AvatarState } from '../constants/avatar.js';
import { DEFAULT_AVATAR, diffCount, hasAnyMakeup } from '../constants/avatar.js';

function makeupCount(s: AvatarState): number {
  let n = 0;
  if (s.lipstick !== 'none') n++;
  if (s.eyeshadow !== 'none') n++;
  if (s.blush !== 'none') n++;
  if (s.highlighter !== 'none') n++;
  return n;
}

export function validateLevelTask(levelId: number, s: AvatarState): { ok: true } | { ok: false; reason: string } {
  switch (levelId) {
    case 1:
      return diffCount(s, DEFAULT_AVATAR) >= 3
        ? { ok: true }
        : { ok: false, reason: 'Измените минимум 3 элемента аватара.' };
    case 2:
      return hasAnyMakeup(s)
        ? { ok: true }
        : { ok: false, reason: 'Добавьте макияж (помада, тени, румяна или хайлайтер).' };
    case 3:
      if (s.dress === 'none') return { ok: false, reason: 'Выберите платье.' };
      if (s.shoes !== 'heels_black' && s.shoes !== 'heels_nude') return { ok: false, reason: 'Нужны каблуки.' };
      if (s.lipstick === 'none' || s.lipstick === 'nude') return { ok: false, reason: 'Добавьте яркую помаду.' };
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
        ['rose', 'coral'].includes(s.lipstick) ||
        s.eyeshadow === 'rose_gold' ||
        ['rose', 'peach'].includes(s.blush);
      return pastel ? { ok: true } : { ok: false, reason: 'Используйте розовые/пастельные акценты.' };
    }
    case 7:
      return s.hairStyle !== DEFAULT_AVATAR.hairStyle || s.hairColor !== DEFAULT_AVATAR.hairColor
        ? { ok: true }
        : { ok: false, reason: 'Смените причёску и/или цвет волос.' };
    case 8:
      return s.eyeColor !== 'brown' || s.lashes !== 'natural' || s.eyeShape !== 'almond'
        ? { ok: true }
        : { ok: false, reason: 'Измените форму глаз, цвет или ресницы.' };
    case 9:
      return s.jacket !== 'none' ? { ok: true } : { ok: false, reason: 'Наденьте жакет/накидку.' };
    case 10:
      return s.bag !== 'none' && s.earrings !== 'none'
        ? { ok: true }
        : { ok: false, reason: 'Нужны и серьги, и сумка.' };
    case 11:
      return s.top === 'tee_white' && s.shoes === 'sneakers_white' && s.lipstick === 'nude'
        ? { ok: true }
        : { ok: false, reason: 'Нейтральный look: белый топ, белые кроссовки, нюд-помада.' };
    case 12:
      return s.highlighter !== 'none' && s.blush !== 'none'
        ? { ok: true }
        : { ok: false, reason: 'Добавьте хайлайтер и румяна.' };
    case 13:
      return s.dress !== 'none' && s.shoes.startsWith('heels') && s.eyeshadow !== 'none'
        ? { ok: true }
        : { ok: false, reason: 'Платье + каблуки + тени.' };
    case 14:
      return ['red', 'berry', 'rose'].includes(s.lipstick) &&
        (s.eyeshadow === 'none' || s.eyeshadow === 'nude_smoke')
        ? { ok: true }
        : { ok: false, reason: 'Яркие губы и нейтральные тени/без теней.' };
    case 15:
      return ['mauve', 'smoky', 'rose_gold'].includes(s.eyeshadow) &&
        (s.lipstick === 'none' || s.lipstick === 'nude')
        ? { ok: true }
        : { ok: false, reason: 'Акцент на глаза: выразительные тени + нейтральные губы.' };
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
        makeupCount(s) >= 3 &&
        hasAnyMakeup(s);
      return glam ? { ok: true } : { ok: false, reason: 'Платье, каблуки и насыщенный макияж (3+ слоя).' };
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
        makeupCount(s) >= 3;
      return full ? { ok: true } : { ok: false, reason: 'Финальный look: платье, каблуки, макияж, серьги и сумка.' };
    }
    default:
      return { ok: false, reason: 'Неизвестный уровень.' };
  }
}
