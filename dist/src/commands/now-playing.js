"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nowPlayingCommand = void 0;
const audio_handler_1 = require("../audio/audio-handler");
const tools_1 = require("../core/tools");
exports.nowPlayingCommand = {
    name: 'nowplaying',
    aliases: ['np'],
    async execute({ member, logger }) {
        const { guild } = member;
        await logger.sendTyping();
        const queue = audio_handler_1.getQueue(guild);
        const currentTrack = queue.playingTrack;
        await logger.log('', tools_1.createCurrentSongEmbed(guild, currentTrack));
    },
};
