import { getQueue } from '../audio/audio-handler';
import { Command } from '../core/command';
import { createCurrentSongEmbed } from '../core/tools';

export const nowPlayingCommand: Command = {
  name: 'nowplaying',
  aliases: ['np'],
  async execute({ member, logger }) {
    const { guild } = member;

    await logger.sendTyping();

    const queue = getQueue(guild);
    const currentTrack = queue.playingTrack;

    await logger.log('', createCurrentSongEmbed(guild, currentTrack));
  },
};
