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
    embed.addField(
      'Now Playing',
      `[${currentTrack.title}](${currentTrack.url})`
    );

    if (tracks.length > 0) {
      embed.addField(
        'Up Next',
        tracks
          .map((song, index) => `\`${index + 1}.\` ${trackAsText(song)}`)
          .join('\n\n')
      );
    }

    await logger.log('', embed);
  },
};
