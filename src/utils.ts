import { Guild, MessageEmbed } from 'discord.js';
import { Song } from './types/queue.type';

export const createCurrentSongEmbed = (
  guild: Guild,
  song: Song
): MessageEmbed => {
  return new MessageEmbed()
    .setTitle('Currently playing 🎵')
    .setDescription(
      `[${song.title}](${song.url})
  
      \`Duration:\` ${formatDuration(song.duration)}

      \`Requested by:\` <@${song.requester.id}>`
    )
    .setFooter(`${formatDate(new Date())} - ${guild.name}`);
};

export const songAsText = (song: Song) =>
  `[${song.title}](${song.url}) · (\`${formatDuration(
    song.duration
  )}\`) Requested by <@${song.requester.id}>`;

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
