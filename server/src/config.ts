import 'dotenv/config';

function req(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

export const PORT = Number(process.env.PORT ?? 3001);
export const MONGODB_URI = req('MONGODB_URI', 'mongodb://127.0.0.1:27017/beauty_avatar');
export const BOT_TOKEN = process.env.BOT_TOKEN ?? '';
export const TELEGRAM_CHANNEL = process.env.TELEGRAM_CHANNEL ?? '@podruzhkahse';
export const WEBAPP_URL = process.env.WEBAPP_URL ?? 'http://localhost:5173';
export const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'change-me-in-production';
