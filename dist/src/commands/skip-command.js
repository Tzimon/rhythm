"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.skipCommand = void 0;
const audio_handler_1 = require("../audio/audio-handler");
exports.skipCommand = {
    name: 'skip',
    aliases: ['s'],
    async execute({ member, logger }) {
        const { guild } = member;
        const queue = audio_handler_1.getQueue(guild);
        queue.skip(false);
        await logger.log(`**⏩ Skipped 👍**`);
    },
};
