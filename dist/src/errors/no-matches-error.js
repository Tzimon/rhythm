"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoMatchesError = void 0;
const bot_error_1 = require("../core/bot-error");
class NoMatchesError extends bot_error_1.BotError {
    message = 'No matches';
}
exports.NoMatchesError = NoMatchesError;
