"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loopCommand = void 0;
const audio_handler_1 = require("../audio/audio-handler");
const queue_1 = require("../audio/queue");
exports.loopCommand = {
    name: 'loop',
    aliases: ['lo'],
    async execute({ member, logger }) {
        const { guild } = member;
        await logger.sendTyping();
        const queue = audio_handler_1.getQueue(guild);
        switch (queue.loopMode) {
            case queue_1.LoopMode.LOOP_SONG:
                queue.loopMode = queue_1.LoopMode.NO_LOOP;
                await logger.log(`**🔂 Disabled**`);
                break;
            default:
                queue.loopMode = queue_1.LoopMode.LOOP_SONG;
                await logger.log(`**🔂 Enabled**`);
                break;
        }
    },
};
