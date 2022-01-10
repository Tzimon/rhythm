"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackAsText = exports.createCurrentSongEmbed = exports.formatDate = exports.formatDuration = void 0;
const discord_js_1 = require("discord.js");
const formatDuration = (duration) => {
    const formatAs2Digit = (number) => `${number < 10 ? '0' : ''}${number}`;
    const durationFormatted = `${formatAs2Digit(Math.floor((duration % (60 * 60)) / 60))}:${formatAs2Digit(duration % 60)}`;
    if (duration >= 60 * 60)
        return `${Math.floor(duration / (60 * 60))}:${durationFormatted}`;
    return durationFormatted;
};
exports.formatDuration = formatDuration;
const formatDate = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
exports.formatDate = formatDate;
const createCurrentSongEmbed = (guild, track) => {
    const embed = new discord_js_1.MessageEmbed();
    embed.setTitle('Currently playing 🎵');
    embed.setDescription(`[${track.title}](${track.url})
    
    \`Duration:\` ${exports.formatDuration(track.duration)}

    \`Requested by:\` <@${track.requester.id}>
    `);
    embed.setFooter(`${exports.formatDate(new Date())} - ${guild.name}`);
    return embed;
};
exports.createCurrentSongEmbed = createCurrentSongEmbed;
const trackAsText = (track) => `[${track.title}](${track.url}) · (\`${exports.formatDuration(track.duration)}\`) Requested by <@${track.requester.id}>`;
exports.trackAsText = trackAsText;
