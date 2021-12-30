import { Client, IntentsString, TextBasedChannels } from 'discord.js';
import type { ClientUser, Message } from 'discord.js';
import { joinCommand } from './commands/join-command';
import { leaveCommand } from './commands/leave-command';
import { playCommand } from './commands/play-command';
import { skipCommand } from './commands/skip-command';
import { Command, CommandCallInfo, CommandLogger } from './core/command';
import { playSkipCommand } from './commands/play-skip-command';
import { loopCommand } from './commands/loop-command';

const defaultPrefix: string = '!';

const intents: Array<IntentsString> = [
  'GUILDS',
  'GUILD_PRESENCES',
  'GUILD_MEMBERS',
  'GUILD_MESSAGES',
  'GUILD_VOICE_STATES',
];

const commands: Array<Command> = [
  joinCommand,
  leaveCommand,
  playCommand,
  skipCommand,
  playSkipCommand,
  loopCommand,
];

export class Bot {
  private readonly client: Client = new Client({ intents });

  public constructor() {
    this.registerEvents();
  }

  private registerEvents(): void {
    this.client.on('ready', () => this.setup());
    this.client.on('messageCreate', (message) => this.parseMessage(message));
  }

  public login(token: string): void {
    this.client.login(token).then(() => console.log('Successfully logged in'));
  }

  private setup(): void {
    const user: ClientUser = this.client.user!;

    user.setStatus('online');
    user.setActivity({
      type: 'LISTENING',
      name: 'Gerhard Müller 🙂',
    });
  }

  private async parseMessage({
    author,
    channel,
    member,
    content,
  }: Message): Promise<void> {
    if (author.bot) return;

    if (!member) {
      channel.send('**I only work in guilds**');
      return;
    }

    if (content.length === 0) return;
    if (!content.startsWith(defaultPrefix)) return;

    const args = content.slice(defaultPrefix.length).split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const logger = new CommandLogger(channel);
    const commandCallInfo: CommandCallInfo = { author, member, args, logger };

    for (const command of commands) {
      if (command.name.toLowerCase() !== commandName) continue;
      return await this.tryExecute(channel, command, commandCallInfo);
    }

    for (const command of commands) {
      for (const alias of command.aliases) {
        if (alias.toLowerCase() !== commandName) continue;
        return await this.tryExecute(channel, command, commandCallInfo);
      }
    }
  }

  private async tryExecute(
    channel: TextBasedChannels,
    command: Command,
    commandInfo: CommandCallInfo
  ): Promise<void> {
    try {
      await command.execute(commandInfo);
    } catch (error) {
      channel.send(`**${error}**`);
    }
  }
}
