require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('Ошибка: BOT_TOKEN не найден в переменных окружения');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  const welcomeText = 'Привет! Я твоя AI подруга. Давай пообщаемся — открой приложение, и мы начнём интересный разговор.';
  
  const keyboard = Markup.inlineKeyboard([
    Markup.button.webApp('Открыть приложение', 'https://ai-girlfriend-nu.vercel.app')
  ]);
  
  ctx.reply(welcomeText, keyboard);
});

bot.catch((err, ctx) => {
  console.error('Ошибка в боте:', err);
});

bot.launch();

console.log('Bot started');

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
