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
  console.log(
    '[boot] MONGODB_URI from env:',
    process.env.MONGODB_URI ? 'yes (length ' + process.env.MONGODB_URI.length + ')' : 'NO — will use default localhost from config'
  );
  await mongoose.connect(MONGODB_URI);
  console.log('[db] connected');

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[api] listening on 0.0.0.0:${PORT}`);
  });

  startTelegramBot();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
