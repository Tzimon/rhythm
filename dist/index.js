"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
dotenv_1.config();
const botToken = process.env.BOT_TOKEN ?? '';
const bot_1 = require("./src/bot");
console.log('Launching bot...');
new bot_1.Bot().login(botToken);
