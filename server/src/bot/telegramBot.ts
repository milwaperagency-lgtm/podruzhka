import { Telegraf } from 'telegraf';
import { BOT_TOKEN, WEBAPP_URL } from '../config.js';

const CHANNEL = process.env.TELEGRAM_CHANNEL_USERNAME ?? 'podruzhkahse';

const webAppButton = { text: '✨ Beauty Avatar Challenge', web_app: { url: WEBAPP_URL } };

export function startTelegramBot() {
  if (!BOT_TOKEN) {
    console.warn('[bot] BOT_TOKEN missing — skipping Telegram bot startup');
    return;
  }

  const bot = new Telegraf(BOT_TOKEN);

  const helpText =
    `Команды бота Подружка 💄\n\n` +
    `/start — приветствие и кнопка игры\n` +
    `/play — открыть мини-приложение\n` +
    `/channel — наш Telegram-канал\n` +
    `/promo — как получить промокоды FREE5…FREE25\n` +
    `/rules — правила уровней (честная проверка образа)\n` +
    `/support — поддержка\n\n` +
    `Игра доступна после подписки на канал внутри приложения.`;

  bot.start(async (ctx) => {
    await ctx.reply(
      'Добро пожаловать в Beauty Avatar Challenge от Подружка 💄\n\nСоздай аватар, проходи уровни и получай промокоды FREE5, FREE10, FREE15, FREE20 и FREE25!',
      {
        reply_markup: {
          keyboard: [[webAppButton]],
          resize_keyboard: true,
        },
      }
    );
  });

  bot.command('help', async (ctx) => {
    await ctx.reply(helpText);
  });

  bot.command('play', async (ctx) => {
    await ctx.reply('Открой мини-приложение:', {
      reply_markup: {
        keyboard: [[{ text: '🎮 Играть', web_app: { url: WEBAPP_URL } }]],
        resize_keyboard: true,
      },
    });
  });

  bot.command('channel', async (ctx) => {
    await ctx.reply(`Наш канал: https://t.me/${CHANNEL.replace('@', '')}\n\nПодписка нужна, чтобы открыть игру в мини-приложении.`);
  });

  bot.command('promo', async (ctx) => {
    await ctx.reply(
      `Промокоды в игре 💝\n\n` +
        `• FREE5 — после 5-го уровня (−5%)\n` +
        `• FREE10 — после 10-го (−10%)\n` +
        `• FREE15 — после 15-го (−15%)\n` +
        `• FREE20 — после 20-го (−20%)\n` +
        `• FREE25 — после 25-го (−25%)\n\n` +
        `Коды появляются в разделе «Промо» в приложении. Условия каждого уровня проверяются по вашему образу — без читов.`
    );
  });

  bot.command('rules', async (ctx) => {
    await ctx.reply(
      `Честная игра 🎯\n\n` +
        `• Уровни проходятся по порядку: сначала 1, потом 2…\n` +
        `• «Завершить уровень» проверяет образ на сервере — как в редакторе.\n` +
        `• Подсказки к заданиям — на вкладке «Уровни» в приложении.\n` +
        `• Сохраняйте аватар перед завершением уровня (кнопка «Сохранить» или завершение автоматически сохранит).`
    );
  });

  bot.command('support', async (ctx) => {
    await ctx.reply(
      'Нужна помощь? Напишите в поддержку магазина Подружка или в комментарии к каналу — мы рядом 💗'
    );
  });

  bot
    .launch()
    .then(() => console.log('[bot] Telegraf started'))
    .catch((err: unknown) => {
      console.error(
        '[bot] Telegraf не запустился (API продолжает работать). Частая причина — 409: второй процесс с тем же BOT_TOKEN (локальный dev, другой контейнер). Остановите дубликат или переведите бота на webhook.',
        err
      );
    });
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
