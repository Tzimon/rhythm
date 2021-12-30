import { MessageEmbed } from 'discord.js';
import { getQueue } from '../audio/audio-handler';
import { Command } from '../core/command';
import { trackAsText } from '../core/tools';

export const queueCommand: Command = {
  name: 'queue',
  aliases: ['q'],
  execute: async ({ member, logger }) => {
    const { guild } = member;
    const queue = getQueue(guild);

    const tracks = queue.tracks;
    const currentTrack = queue.playingTrack;

    const embed = new MessageEmbed();

    embed.setTitle(`Queue for ${guild.name}`);
    embed.addField('Now Playing', trackAsText(currentTrack));

    const trackCount = tracks.length;
    const displayLimit = 5;

    if (trackCount > 0) {
      let tracksAsText = tracks
        .map((song, index) => `\`${index + 1}.\` ${trackAsText(song)}`)
        .slice(0, displayLimit)
        .join('\n\n');

      if (trackCount > displayLimit)
        tracksAsText += `\n\n${trackCount - displayLimit} more`;

      embed.addField('Up Next', tracksAsText);
    }

    await logger.log('', embed);
  },
};
