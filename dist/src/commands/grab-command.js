"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grabCommand = void 0;
const audio_handler_1 = require("../audio/audio-handler");
const tools_1 = require("../core/tools");
exports.grabCommand = {
    name: 'grab',
    aliases: [],
    async execute({ member }) {
        const { guild } = member;
        const queue = audio_handler_1.getQueue(guild);
        const currentTrack = queue.playingTrack;
        await member.send({
            embeds: [tools_1.createCurrentSongEmbed(guild, currentTrack)],
        });
    },
};
