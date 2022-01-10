"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IllegalChannelTypeError = void 0;
const bot_error_1 = require("../core/bot-error");
class IllegalChannelTypeError extends bot_error_1.BotError {
    message = 'I only support casual voice channels';
}
exports.IllegalChannelTypeError = IllegalChannelTypeError;
