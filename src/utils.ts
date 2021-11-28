import { Guild, MessageEmbed } from 'discord.js';
import { Song } from './types/queue.type';

export const createCurrentSongEmbed = (
  guild: Guild,
  song: Song
): MessageEmbed => {
  return new MessageEmbed()
    .setColor('#55ffaa')
    .setTitle('Currently playing 🎵')
    .setDescription(
      `[${song.title}](${song.url})
  
      \`Duration:\` ${getDurationFormatted(song.duration)}

      \`Requested by:\` <@${song.requester.id}>`
    )
    .setFooter(`${getDateFormatted(new Date())} - ${guild.name}`);
};

export const getDurationFormatted = (duration: number) => {
  const durationFormatted = `${Math.floor(duration / 60)}:${duration % 60}`;

  if (duration >= 60 * 60)
    return `${Math.floor(duration / (60 * 60))} ${durationFormatted}`;

  return durationFormatted;
};

export const getDateFormatted = (date: Date): string =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
