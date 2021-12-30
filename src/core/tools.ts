import { Guild, MessageEmbed } from 'discord.js';
import { Track } from '../audio/track';

export const formatDuration = (duration: number) => {
  const formatAs2Digit = (number: number) =>
    `${number < 10 ? '0' : ''}${number}`;

  const durationFormatted = `${formatAs2Digit(
    Math.floor((duration % (60 * 60)) / 60)
  )}:${formatAs2Digit(duration % 60)}`;

  if (duration >= 60 * 60)
    return `${Math.floor(duration / (60 * 60))}:${durationFormatted}`;

  return durationFormatted;
};

export const formatDate = (date: Date): string =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

export const createCurrentSongEmbed = (
  guild: Guild,
  track: Track
): MessageEmbed => {
  const embed = new MessageEmbed();

  embed.setTitle('Currently playing 🎵');
  embed.setDescription(
    `[${track.title}](${track.url})
    
    \`Duration:\` ${formatDuration(track.duration)}

    \`Requested by:\` <@${track.requester.id}>
    `
  );
  embed.setFooter(`${formatDate(new Date())} - ${guild.name}`);

  return embed;
};

export const trackAsText = (track: Track) =>
  `[${track.title}](${track.url}) · (\`${formatDuration(
    track.duration
  )}\`) Requested by <@${track.requester.id}>`;
