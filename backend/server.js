import 'dotenv/config';
import app from './api.js';
import { startBot } from './bot.js';

const PORT = process.env.PORT || 3100;

// Start API server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 API сервер запущен на порту ${PORT}`);
});

// Start Telegram bot
startBot();
