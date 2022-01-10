"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playSkipCommand = void 0;
const discord_js_1 = require("discord.js");
const audio_handler_1 = require("../audio/audio-handler");
const tools_1 = require("../core/tools");
const invalid_syntax_error_1 = require("../errors/invalid-syntax-error");
exports.playSkipCommand = {
    name: 'playskip',
    aliases: ['ps'],
    async execute({ member, args, logger }) {
        const { guild, user } = member;
        const channel = audio_handler_1.getVoiceChannel(member);
        if (args.length <= 0)
            throw new invalid_syntax_error_1.InvalidSyntaxError();
        const query = args.join(' ');
        const searchingMessage = logger.logNative(`**🎵 Searching 🔎** \`${query}\``);
        const queue = audio_handler_1.getQueue(guild);
        queue.skip(true);
        const track = await audio_handler_1.searchTrack(user, query);
        queue.enqueue(track, true);
        await queue.play(channel);
        const embed = new discord_js_1.MessageEmbed();
        embed.setTitle(track.title);
        embed.setURL(track.url);
        embed.addField('Channel', track.channelName, true);
        embed.addField('Song Duration', tools_1.formatDuration(track.duration), true);
        embed.setAuthor('Now Playing');
        embed.setThumbnail(track.thumbnailUrl);
        await searchingMessage;
        await logger.log('', embed);
    },
};
