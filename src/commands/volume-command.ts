import { getQueue } from '../audio/audio-handler';
import { Command } from '../core/command';
import { InvalidSyntaxError } from '../errors/invalid-syntax-error';

export const volumeCommand: Command = {
  name: 'volume',
  aliases: ['vol'],
  async execute({ args, member, logger }) {
    const { guild } = member;

    if (args.length !== 1) throw new InvalidSyntaxError();

    const volume: number = +args[0];

    if (!Number.isInteger(volume)) throw new InvalidSyntaxError();

    const queue = getQueue(guild);
    queue.volume = volume;

    await logger.log(`🔊 Set volume to ${volume}%`);
  },
};
