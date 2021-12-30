import { getQueue } from '../audio/audio-handler';
import { LoopMode } from '../audio/queue';
import { Command } from '../core/command';

export const loopCommand: Command = {
  name: 'loop',
  aliases: ['lo'],
  async execute({ member, logger }) {
    const { guild } = member;

    await logger.sendTyping();

    const queue = getQueue(guild);

    switch (queue.loopMode) {
      case LoopMode.NO_LOOP:
        queue.loopMode = LoopMode.LOOP_SONG;
        await logger.log(`**🔂 Enabled**`);
        break;
      default:
        queue.loopMode = LoopMode.NO_LOOP;
        await logger.log(`**🔂 Disabled**`);
        break;
    }
  },
};
