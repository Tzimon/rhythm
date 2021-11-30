import { Client } from 'discord.js';
import * as commands from './commands';
import type { ClientUser, Message } from 'discord.js';
import type { Config } from './types/config.type';
import type { Command, CommandInfo } from './types/command.type';

export class Bot {
  private readonly client: Client;

  public constructor(token: string, private readonly config: Config) {
    this.client = new Client({
      intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'],
    });

    this.client.on('ready', () => this.setup());
    this.client.on('messageCreate', (message) => this.processMessage(message));

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

  private processMessage(message: Message): void {
    const { author, channel, member, content } = message;

    if (author.bot) return;

    if (!member) {
      channel.send('**I only work in guilds**');
      return;
    }

    if (content.length === 0) return;
    if (!content.startsWith(this.config.defaultPrefix)) return;

    const commandMessage = content.substring(this.config.defaultPrefix.length);

    if (commandMessage.length === 0) return;

    const args = commandMessage.split(' ');
    const commandName = args.shift()!.toLowerCase();

    const commandInfo: CommandInfo = { author, channel, member, args };

    try {
      for (const command of Object.values(commands)) {
        if (command.name.toLowerCase() === commandName) {
          this.tryExecute(command, commandInfo);
          return;
        }
      }

      for (const command of Object.values(commands)) {
        for (const alias of command.aliases) {
          if (alias.toLowerCase() === commandName) {
            this.tryExecute(command, commandInfo);
            return;
          }
        }
      }
    } catch {}
  }

  private async tryExecute(
    command: Command,
    commandInfo: CommandInfo
  ): Promise<void> {
    try {
      await command.execute(commandInfo);
    } catch (error) {
      commandInfo.channel.send(`**❌ ${error}**`);
    }
  }
}
