import { getQueue } from '../audio/audio-handler';
import { LoopMode } from '../audio/queue';
import { Command } from '../core/command';

export const loopQueueCommand: Command = {
  name: 'loopqueue',
  aliases: ['lq'],
  async execute({ member, logger }) {
    const { guild } = member;

    await logger.sendTyping();

    const queue = getQueue(guild);

    switch (queue.loopMode) {
      case LoopMode.LOOP_QUEUE:
        queue.loopMode = LoopMode.NO_LOOP;
        await logger.log(`**🔁 Disabled**`);
        break;
      default:
        queue.loopMode = LoopMode.LOOP_QUEUE;
        await logger.log(`**🔁 Enabled**`);
        break;
    }
  },
};
