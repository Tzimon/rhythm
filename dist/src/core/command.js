"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandLogger = void 0;
class CommandLogger {
    channel;
    constructor(channel) {
        this.channel = channel;
    }
    async sendTyping() {
        return await this.channel.sendTyping();
    }
    async log(message, ...embeds) {
        return await this.channel.send({
            content: message.length > 0 ? `**${message}**` : undefined,
            embeds: embeds,
        });
    }
    async logNative(message) {
        return await this.channel.send(message);
    }
}
exports.CommandLogger = CommandLogger;
