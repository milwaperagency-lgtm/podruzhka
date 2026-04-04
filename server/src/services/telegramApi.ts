import { BOT_TOKEN, TELEGRAM_CHANNEL } from '../config.js';

const BASE = () => `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function getChatMemberStatus(userId: number): Promise<{
  ok: boolean;
  status?: string;
}> {
  if (!BOT_TOKEN) return { ok: false, status: 'no_bot_token' };
  const url = new URL(`${BASE()}/getChatMember`);
  url.searchParams.set('chat_id', TELEGRAM_CHANNEL);
  url.searchParams.set('user_id', String(userId));
  const res = await fetch(url);
  const data = (await res.json()) as {
    ok: boolean;
    result?: { status?: string };
    description?: string;
  };
  if (!data.ok || !data.result?.status) {
    return { ok: false, status: data.description ?? 'error' };
  }
  const st = data.result.status;
  const allowed = ['creator', 'administrator', 'member', 'restricted'];
  return { ok: allowed.includes(st), status: st };
}
