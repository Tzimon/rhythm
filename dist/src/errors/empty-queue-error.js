"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyQueueError = void 0;
const bot_error_1 = require("../core/bot-error");
class EmptyQueueError extends bot_error_1.BotError {
    message = 'The queue is empty';
}
exports.EmptyQueueError = EmptyQueueError;
