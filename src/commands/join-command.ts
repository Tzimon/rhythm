import { Command } from '../core/command';
import { connect, getVoiceChannel } from '../audio/audio-handler';

export const joinCommand: Command = {
  name: 'join',
  aliases: ['j', 'connect', 'con', 'fuckon'],
  async execute({ member, logger }) {
    const channel = getVoiceChannel(member);

    await connect(channel);
    await logger.log(`👍 Joined \`${channel.name}\``);
  },
};
