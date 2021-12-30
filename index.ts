import dotenv from 'dotenv';
dotenv.config();

const botToken = process.env.BOT_TOKEN ?? '';

import { readFileSync } from 'fs';
import { Bot } from './src/bot';
import { Config } from './src/types/config.type';

const config: Config = JSON.parse(readFileSync('./config.json', 'utf-8'));

console.log('Launching bot...');
new Bot(config).launch(botToken);
