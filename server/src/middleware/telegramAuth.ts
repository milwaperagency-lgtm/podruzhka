import type { Request, Response, NextFunction } from 'express';
import { BOT_TOKEN } from '../config.js';
import { parseAndValidateInitData, type TelegramUser } from '../utils/validateInitData.js';

export interface AuthedRequest extends Request {
  telegramUser?: TelegramUser;
}

export function telegramAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const initData = req.header('X-Telegram-Init-Data');
  if (!initData) {
    res.status(401).json({ error: 'missing_init_data' });
    return;
  }
  if (!BOT_TOKEN) {
    res.status(500).json({ error: 'bot_not_configured' });
    return;
  }
  const v = parseAndValidateInitData(initData, BOT_TOKEN);
  if (!v.ok) {
    res.status(401).json({ error: 'invalid_init_data', detail: v.error });
    return;
  }
  req.telegramUser = v.user;
  next();
}
