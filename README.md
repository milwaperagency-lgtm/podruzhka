# Beauty Avatar Challenge

Telegram Mini App для beauty-ритейла в стиле Podrygka: слойный редактор аватара, уровни с заданиями, проверка подписки на канал и промокоды `PODRYGKA-XXXX`.

## Стек

- **Клиент:** React, TypeScript, Vite, TailwindCSS, Konva (`react-konva`), `@twa-dev/sdk`
- **Сервер:** Node.js, Express, MongoDB (Mongoose), Telegraf (бот)
- **Интеграции:** Telegram Bot API (`getChatMember`), Web App initData (HMAC-проверка)

## Структура

```
├── client/          # Vite SPA (Mini App)
├── server/          # API + бот
└── package.json     # опционально: concurrently для dev
```

## Локальный запуск

1. **MongoDB** — локально или [MongoDB Atlas](https://www.mongodb.com/atlas).

2. **Сервер**

   ```bash
   cd server
   cp .env.example .env
   # Заполните BOT_TOKEN, MONGODB_URI, TELEGRAM_CHANNEL (@podruzhkahse), WEBAPP_URL
   npm install
   npm run dev
   ```

   API по умолчанию: `http://localhost:3001`.

3. **Клиент**

   ```bash
   cd client
   npm install
   npm run dev
   ```

   В dev-режиме Vite проксирует `/api` на `http://localhost:3001` (см. `client/vite.config.ts`).

4. **Telegram**

   - Создайте бота у [@BotFather](https://t.me/BotFather), получите `BOT_TOKEN`.
   - Включите домен Mini App: `/newapp` или настройки бота → Bot Settings → Configure Mini App / Menu Button — укажите URL фронтенда (после деплоя).
   - Добавьте бота **администратором** в канал (или используйте публичный `@channel`), чтобы `getChatMember` работал для подписчиков.
   - Переменная `TELEGRAM_CHANNEL` должна совпадать с каналом (например `@podrygka_channel`).

Без открытия из Telegram `initData` пустой — приложение покажет сообщение «Откройте из бота».

## Деплой

### Frontend (Vercel)

1. Подключите репозиторий, **Root Directory:** `client`.
2. Build: `npm run build`, Output: `dist`.
3. Environment Variables:
   - `VITE_API_URL` — публичный URL бэкенда **без** `/api` на конце, например `https://beauty-api.onrender.com`.
4. После деплоя укажите этот URL в BotFather как URL Mini App и в `WEBAPP_URL` на сервере.

### Backend (Railway или Render)

1. **Root Directory:** `server`.
2. Build: `npm install && npm run build`, Start: `npm start` (или `node dist/index.js`).
3. Переменные окружения: см. `server/.env.example`.
4. Выдайте публичный HTTPS URL и пропишите его в `VITE_API_URL` и `WEBAPP_URL`.

### MongoDB Atlas

Создайте кластер, пользователя, whitelist IP (`0.0.0.0/0` для сервера), скопируйте connection string в `MONGODB_URI`.

## Админ API

Заголовок: `X-Admin-Secret: <ADMIN_SECRET>` (значение из `.env`).

| Метод | Путь | Описание |
|--------|------|----------|
| POST | `/api/admin/promo/generate` | Body: `{ "count": 10, "discount": 15 }` — массовые коды |
| GET | `/api/admin/players` | Список игроков |
| GET | `/api/admin/stats/levels` | Распределение по `max_completed_level` |

Игровые промокоды за уровни 5 / 10 / 15 / 20 создаются автоматически и привязаны к `telegram_id`.

## Полезные ссылки

- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Проверка initData](https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app)
- [getChatMember](https://core.telegram.org/bots/api#getchatmember)

## Лицензия

MIT (пример проекта для бренда).
