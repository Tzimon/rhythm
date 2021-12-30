import { getQueue } from '../audio/audio-handler';
import { Command } from '../core/command';
import { createCurrentSongEmbed } from '../core/tools';

export const grabCommand: Command = {
  name: 'grab',
  aliases: [],
  async execute({ member }) {
    const { guild } = member;

    const queue = getQueue(guild);
    const currentTrack = queue.playingTrack;

    await member.send({
      embeds: [createCurrentSongEmbed(guild, currentTrack)],
    });
  },
};
