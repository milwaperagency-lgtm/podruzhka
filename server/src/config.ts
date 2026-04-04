import 'dotenv/config';

function req(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

export const PORT = Number(process.env.PORT ?? 3001);

/** В production fallback на localhost запрещён — иначе не видно, что MONGODB_URI не передан в контейнер (Timeweb). Локально: server/.env или дефолт. */
const isProd = process.env.NODE_ENV === 'production';
export const MONGODB_URI = isProd
  ? req('MONGODB_URI')
  : (process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/beauty_avatar');

if (isProd && MONGODB_URI.includes('127.0.0.1')) {
  console.error('[config] FATAL: MONGODB_URI указывает на localhost в production — проверьте переменные Timeweb.');
}
export const BOT_TOKEN = process.env.BOT_TOKEN ?? '';
export const TELEGRAM_CHANNEL = process.env.TELEGRAM_CHANNEL ?? '@podruzhkahse';
export const WEBAPP_URL = process.env.WEBAPP_URL ?? 'http://localhost:5173';
export const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'change-me-in-production';
