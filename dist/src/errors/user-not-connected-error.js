"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotConnectedError = void 0;
const bot_error_1 = require("../core/bot-error");
class UserNotConnectedError extends bot_error_1.BotError {
    message = 'You have to be in a voice channel to use this command';
}
exports.UserNotConnectedError = UserNotConnectedError;
