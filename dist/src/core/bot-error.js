"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotError = void 0;
class BotError extends Error {
    specialEmoji;
    toString() {
        return `${this.specialEmoji ?? '❌'} ${this.message}`;
    }
}
exports.BotError = BotError;
