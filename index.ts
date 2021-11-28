import dotenv from 'dotenv';
dotenv.config();

const { BOT_TOKEN } = process.env;

if (!BOT_TOKEN) process.exit(1);

import { readFileSync } from 'fs';
import { Bot } from './src/bot';
import { Config } from './src/types/config.type';

const config: Config = JSON.parse(readFileSync('./config.json', 'utf-8'));

new Bot(BOT_TOKEN, config);
