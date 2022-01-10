"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueCommand = void 0;
const discord_js_1 = require("discord.js");
const audio_handler_1 = require("../audio/audio-handler");
const tools_1 = require("../core/tools");
exports.queueCommand = {
    name: 'queue',
    aliases: ['q'],
    execute: async ({ member, logger }) => {
        const { guild } = member;
        const queue = audio_handler_1.getQueue(guild);
        const tracks = queue.tracks;
        const currentTrack = queue.playingTrack;
        const embed = new discord_js_1.MessageEmbed();
        embed.setTitle(`Queue for ${guild.name}`);
        embed.addField('Now Playing', tools_1.trackAsText(currentTrack));
        const trackCount = tracks.length;
        const displayLimit = 5;
        if (trackCount > 0) {
            let tracksAsText = tracks
                .map((song, index) => `\`${index + 1}.\` ${tools_1.trackAsText(song)}`)
                .slice(0, displayLimit)
                .join('\n\n');
            if (trackCount > displayLimit)
                tracksAsText += `\n\n${trackCount - displayLimit} more`;
            embed.addField('Up Next', tracksAsText);
        }
        await logger.log('', embed);
    },
};
