"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidSyntaxError = void 0;
const bot_error_1 = require("../core/bot-error");
class InvalidSyntaxError extends bot_error_1.BotError {
    message = 'Invalid syntax';
    specialEmoji = '🥴';
}
exports.InvalidSyntaxError = InvalidSyntaxError;
