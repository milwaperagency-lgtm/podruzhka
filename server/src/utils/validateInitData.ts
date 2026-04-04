import crypto from 'node:crypto';

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export function parseAndValidateInitData(
  initData: string,
  botToken: string
): { ok: true; user: TelegramUser } | { ok: false; error: string } {
  if (!initData || !botToken) return { ok: false, error: 'missing_data' };
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return { ok: false, error: 'no_hash' };

  const pairs: [string, string][] = [];
  for (const [k, v] of params.entries()) {
    if (k === 'hash') continue;
    pairs.push([k, v]);
  }
  pairs.sort(([a], [b]) => a.localeCompare(b));
  const dataCheckString = pairs.map(([k, v]) => `${k}=${v}`).join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const computed = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  if (computed !== hash) return { ok: false, error: 'bad_hash' };

  const userRaw = params.get('user');
  if (!userRaw) return { ok: false, error: 'no_user' };
  try {
    const user = JSON.parse(userRaw) as TelegramUser;
    if (!user?.id) return { ok: false, error: 'invalid_user' };
    return { ok: true, user };
  } catch {
    return { ok: false, error: 'parse_error' };
  }
}
