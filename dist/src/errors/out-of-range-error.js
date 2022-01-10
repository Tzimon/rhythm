"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutOfRangeError = void 0;
const bot_error_1 = require("../core/bot-error");
class OutOfRangeError extends bot_error_1.BotError {
    message;
    specialEmoji = '🤡';
    constructor(minimum, maximum) {
        super();
        this.message = `Number is out of range: [${minimum}; ${maximum}]`;
    }
}
exports.OutOfRangeError = OutOfRangeError;
