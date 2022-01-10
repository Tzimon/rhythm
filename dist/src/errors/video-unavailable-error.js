"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoUnavailableError = void 0;
const bot_error_1 = require("../core/bot-error");
class VideoUnavailableError extends bot_error_1.BotError {
    message = 'Video unavailable';
}
exports.VideoUnavailableError = VideoUnavailableError;
