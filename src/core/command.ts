import {
  GuildMember,
  Message,
  MessageEmbed,
  TextBasedChannel,
  User,
} from 'discord.js';

export interface Command {
  readonly name: string;
  readonly aliases: Array<string>;
  execute(callInfo: CommandCallInfo): Promise<void>;
}

export interface CommandCallInfo {
  author: User;
  member: GuildMember;
  args: Array<string>;
  logger: CommandLogger;
}

export class CommandLogger {
  public constructor(private channel: TextBasedChannel) {}

  public async sendTyping(): Promise<void> {
    return await this.channel.sendTyping();
  }

  public async log(
    message: string,
    ...embeds: Array<MessageEmbed>
  ): Promise<Message> {
    return await this.channel.send({
      content: message.length > 0 ? `**${message}**` : undefined,
      embeds: embeds,
    });
  }

  public async logNative(message: string): Promise<Message> {
    return await this.channel.send(message);
  }
}
