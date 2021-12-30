import { getQueue } from '../audio/audio-handler';
import { Command } from '../core/command';

export const skipCommand: Command = {
  name: 'skip',
  aliases: ['s'],
  async execute({ member, logger }) {
    const { guild } = member;

    const queue = getQueue(guild);
    queue.skip(false);

    await logger.log(`**⏩ Skipped 👍**`);
  },
};
