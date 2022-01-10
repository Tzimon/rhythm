"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinCommand = void 0;
const audio_handler_1 = require("../audio/audio-handler");
exports.joinCommand = {
    name: 'join',
    aliases: ['j', 'connect', 'con', 'fuckon'],
    async execute({ member, logger }) {
        const channel = audio_handler_1.getVoiceChannel(member);
        await audio_handler_1.connect(channel);
        await logger.log(`👍 Joined \`${channel.name}\``);
    },
};
