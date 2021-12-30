import dotenv from 'dotenv';
dotenv.config();

const botToken = process.env.BOT_TOKEN ?? '';

import { Bot } from './src/bot';

console.log('Launching bot...');
new Bot().login(botToken);
