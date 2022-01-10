"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotConnectedError = void 0;
const bot_error_1 = require("../core/bot-error");
class NotConnectedError extends bot_error_1.BotError {
    message = 'I am not connected to a voice channel';
}
exports.NotConnectedError = NotConnectedError;
