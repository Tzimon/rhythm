import { getQueue } from '../audio/audio-handler';
import { Command } from '../core/command';
import { InvalidSyntaxError } from '../errors/invalid-syntax-error';
import { EmptyQueueError } from '../errors/empty-queue-error';
import { OutOfRangeError } from '../errors/out-of-range-error';

export const removeCommand: Command = {
  name: 'remove',
  aliases: [],
  async execute({ args, member, logger }) {
    const { guild } = member;

    if (args.length !== 1) throw new InvalidSyntaxError();

    const index: number = +args[0];

    if (!Number.isInteger(index)) throw new InvalidSyntaxError();

    const queue = getQueue(guild);
    const tracks = queue.tracks;
    const trackCount = tracks.length;

    if (trackCount === 0) throw new EmptyQueueError();

    if (index < 1 || index > trackCount)
      throw new OutOfRangeError(1, trackCount);

    const track = queue.remove(index - 1);

    await logger.log(`✅ Removed \`${track.title}\``);
  },
};
