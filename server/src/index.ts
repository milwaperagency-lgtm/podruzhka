import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { MONGODB_URI, PORT } from './config.js';
import api from './routes/api.js';
import { startTelegramBot } from './bot/telegramBot.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', api);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('[db] connected');

  app.listen(PORT, () => {
    console.log(`[api] http://localhost:${PORT}`);
  });

  startTelegramBot();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
