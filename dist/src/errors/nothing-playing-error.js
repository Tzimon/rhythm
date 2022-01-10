"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NothingPlayingError = void 0;
const bot_error_1 = require("../core/bot-error");
class NothingPlayingError extends bot_error_1.BotError {
    message = 'Nothing playing in your server';
}
exports.NothingPlayingError = NothingPlayingError;
