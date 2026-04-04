import { Router } from 'express';
import type { Request, Response } from 'express';
import { UserModel } from '../models/User.js';
import { PromoCodeModel } from '../models/PromoCode.js';
import { telegramAuth, type AuthedRequest } from '../middleware/telegramAuth.js';
import { getChatMemberStatus } from '../services/telegramApi.js';
import { DEFAULT_AVATAR, type AvatarState } from '../constants/avatar.js';
import { validateLevelTask } from '../game/levelChecks.js';
import { LEVEL_POINTS } from '../constants/levels.js';
import { createPromoForLevel } from '../services/promoService.js';
import { ADMIN_SECRET } from '../config.js';
import crypto from 'node:crypto';

const router = Router();

async function ensureUser(telegramId: number, username?: string) {
  let u = await UserModel.findOne({ telegram_id: telegramId });
  if (!u) {
    u = await UserModel.create({
      telegram_id: telegramId,
      username,
      max_completed_level: 0,
      points: 0,
      created_avatar: { ...DEFAULT_AVATAR },
      onboarding_complete: false,
      subscription_ok: false,
    });
  }
  return u;
}

router.get('/me', telegramAuth, async (req: AuthedRequest, res: Response) => {
  const tu = req.telegramUser!;
  const sub = await getChatMemberStatus(tu.id);
  const u = await ensureUser(tu.id, tu.username);
  u.username = tu.username ?? u.username;
  u.subscription_ok = sub.ok;
  await u.save();

  res.json({
    user: {
      telegram_id: u.telegram_id,
      username: u.username,
      level: u.max_completed_level + 1,
      max_completed_level: u.max_completed_level,
      points: u.points,
      created_avatar: u.created_avatar,
      onboarding_complete: u.onboarding_complete,
    },
    subscription: { ok: sub.ok, status: sub.status },
  });
});

router.post('/subscription/check', telegramAuth, async (req: AuthedRequest, res: Response) => {
  const tu = req.telegramUser!;
  const sub = await getChatMemberStatus(tu.id);
  const u = await ensureUser(tu.id, tu.username);
  u.subscription_ok = sub.ok;
  await u.save();
  res.json({ ok: sub.ok, status: sub.status });
});

router.post('/user/onboarding', telegramAuth, async (req: AuthedRequest, res: Response) => {
  const tu = req.telegramUser!;
  const u = await ensureUser(tu.id, tu.username);
  u.onboarding_complete = true;
  await u.save();
  res.json({ ok: true });
});

router.put('/user/avatar', telegramAuth, async (req: AuthedRequest, res: Response) => {
  const tu = req.telegramUser!;
  const created_avatar = req.body?.created_avatar as AvatarState | undefined;
  if (!created_avatar) {
    res.status(400).json({ error: 'missing_avatar' });
    return;
  }
  const u = await ensureUser(tu.id, tu.username);
  u.created_avatar = created_avatar;
  await u.save();
  res.json({ ok: true });
});

router.post('/game/level/complete', telegramAuth, async (req: AuthedRequest, res: Response) => {
  const tu = req.telegramUser!;
  const levelId = Number(req.body?.levelId);
  const created_avatar = req.body?.created_avatar as AvatarState | undefined;
  if (!Number.isFinite(levelId) || !created_avatar) {
    res.status(400).json({ error: 'bad_request' });
    return;
  }

  const u = await ensureUser(tu.id, tu.username);
  const next = u.max_completed_level + 1;
  if (levelId !== next) {
    res.status(400).json({ error: 'wrong_level', expected: next });
    return;
  }

  const check = validateLevelTask(levelId, created_avatar);
  if (!check.ok) {
    res.status(400).json({ error: 'task_incomplete', reason: check.reason });
    return;
  }

  const pts = LEVEL_POINTS[levelId] ?? 50;
  u.max_completed_level = levelId;
  u.points += pts;
  u.created_avatar = created_avatar;
  await u.save();

  let promo: { code: string; discount: number } | undefined;
  try {
    const p = await createPromoForLevel(tu.id, levelId);
    if (p) promo = p;
  } catch {
    /* ignore promo failure */
  }

  res.json({
    ok: true,
    level: u.max_completed_level + 1,
    points: u.points,
    promo,
  });
});

router.get('/user/rewards', telegramAuth, async (req: AuthedRequest, res: Response) => {
  const tu = req.telegramUser!;
  const rows = await PromoCodeModel.find({ user_id: tu.id }).sort({ created_at: -1 }).lean();
  res.json({
    promos: rows.map((r) => ({
      code: r.code,
      discount: r.discount,
      created_at: r.created_at,
      used: r.used,
    })),
  });
});

function adminGuard(req: Request, res: Response, next: () => void) {
  const secret = req.header('X-Admin-Secret');
  if (!secret || secret !== ADMIN_SECRET) {
    res.status(403).json({ error: 'forbidden' });
    return;
  }
  next();
}

router.post('/admin/promo/generate', adminGuard, async (req: Request, res: Response) => {
  const count = Math.min(500, Math.max(1, Number(req.body?.count ?? 1)));
  const discount = Math.min(100, Math.max(1, Number(req.body?.discount ?? 10)));
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const suffix = crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6);
    const code = `PODRYGKA-${suffix}`;
    try {
      await PromoCodeModel.create({ code, discount, used: false, user_id: 0 });
      codes.push(code);
    } catch {
      i--;
    }
  }
  res.json({ ok: true, codes, discount });
});

router.get('/admin/players', adminGuard, async (_req: Request, res: Response) => {
  const users = await UserModel.find({})
    .sort({ points: -1 })
    .limit(500)
    .lean();
  res.json({
    players: users.map((u) => ({
      telegram_id: u.telegram_id,
      username: u.username,
      max_completed_level: u.max_completed_level,
      points: u.points,
      subscription_ok: u.subscription_ok,
    })),
  });
});

router.get('/admin/stats/levels', adminGuard, async (_req: Request, res: Response) => {
  const users = await UserModel.find({}).lean();
  const dist: Record<number, number> = {};
  for (const u of users) {
    const k = u.max_completed_level;
    dist[k] = (dist[k] ?? 0) + 1;
  }
  res.json({ distribution: dist, total_players: users.length });
});

export default router;
