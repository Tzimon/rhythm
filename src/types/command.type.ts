import type { GuildMember, TextBasedChannels, User } from 'discord.js';

export interface Command {
  name: string;
  aliases: Array<string>;
  execute: (commandInfo: CommandInfo) => Promise<void>;
}

export interface CommandInfo {
  author: User;
  channel: TextBasedChannels;
  member: GuildMember;
  args: Array<string>;
}
