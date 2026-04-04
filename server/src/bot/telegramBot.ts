import { Telegraf } from 'telegraf';
import { BOT_TOKEN, WEBAPP_URL } from '../config.js';

const webAppButton = { text: '✨ Beauty Avatar Challenge', web_app: { url: WEBAPP_URL } };

export function startTelegramBot() {
  if (!BOT_TOKEN) {
    console.warn('[bot] BOT_TOKEN missing — skipping Telegram bot startup');
    return;
  }

  const bot = new Telegraf(BOT_TOKEN);

  bot.start(async (ctx) => {
    await ctx.reply(
      'Добро пожаловать в Beauty Avatar Challenge от Подружка 💄\n\nСоздай аватар, проходи уровни и получай промокоды!',
      {
        reply_markup: {
          keyboard: [[webAppButton]],
          resize_keyboard: true,
        },
      }
    );
  });

  bot.command('play', async (ctx) => {
    await ctx.reply('Открой мини-приложение:', {
      reply_markup: {
        keyboard: [[{ text: 'Играть', web_app: { url: WEBAPP_URL } }]],
        resize_keyboard: true,
      },
    });
  });

  bot.launch().then(() => console.log('[bot] Telegraf started'));
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
