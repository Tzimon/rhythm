import { disconnect } from '../audio/audio-handler';
import { Command } from '../core/command';

export const leaveCommand: Command = {
  name: 'leave',
  aliases: ['l', 'disconnect', 'dc', 'disc', 'fuckoff'],
  execute: async ({ member }) => disconnect(member.guild),
};
