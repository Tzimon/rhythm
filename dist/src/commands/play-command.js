"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playCommand = void 0;
const discord_js_1 = require("discord.js");
const audio_handler_1 = require("../audio/audio-handler");
const invalid_syntax_error_1 = require("../errors/invalid-syntax-error");
const tools_1 = require("../core/tools");
exports.playCommand = {
    name: 'play',
    aliases: ['p'],
    async execute({ args, member, logger }) {
        const { user, guild } = member;
        const channel = audio_handler_1.getVoiceChannel(member);
        if (args.length <= 0)
            throw new invalid_syntax_error_1.InvalidSyntaxError();
        const query = args.join(' ');
        const searchingMessage = logger.logNative(`**🎵 Searching 🔎** \`${query}\``);
        const track = await audio_handler_1.searchTrack(user, query);
        const queue = audio_handler_1.getQueue(guild);
        queue.enqueue(track, false);
        await queue.play(channel);
        const embed = new discord_js_1.MessageEmbed();
        embed.setTitle(track.title);
        embed.setURL(track.url);
        embed.addField('Channel', track.channelName, true);
        embed.addField('Song Duration', tools_1.formatDuration(track.duration), true);
        embed.setAuthor('Added to queue');
        embed.setThumbnail(track.thumbnailUrl);
        await searchingMessage;
        await logger.log('', embed);
    },
};
