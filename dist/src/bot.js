"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const discord_js_1 = require("discord.js");
const command_1 = require("./core/command");
const join_command_1 = require("./commands/join-command");
const leave_command_1 = require("./commands/leave-command");
const play_command_1 = require("./commands/play-command");
const skip_command_1 = require("./commands/skip-command");
const play_skip_command_1 = require("./commands/play-skip-command");
const loop_command_1 = require("./commands/loop-command");
const loop_queue_command_1 = require("./commands/loop-queue-command");
const now_playing_1 = require("./commands/now-playing");
const grab_command_1 = require("./commands/grab-command");
const queue_command_1 = require("./commands/queue-command");
const volume_command_1 = require("./commands/volume-command");
const remove_command_1 = require("./commands/remove-command");
const bot_error_1 = require("./core/bot-error");
const defaultPrefix = '!';
const intents = [
    'GUILDS',
    'GUILD_PRESENCES',
    'GUILD_MEMBERS',
    'GUILD_MESSAGES',
    'GUILD_VOICE_STATES',
];
const commands = [
    join_command_1.joinCommand,
    leave_command_1.leaveCommand,
    play_command_1.playCommand,
    skip_command_1.skipCommand,
    play_skip_command_1.playSkipCommand,
    loop_command_1.loopCommand,
    loop_queue_command_1.loopQueueCommand,
    now_playing_1.nowPlayingCommand,
    grab_command_1.grabCommand,
    queue_command_1.queueCommand,
    volume_command_1.volumeCommand,
    remove_command_1.removeCommand,
];
class Bot {
    client = new discord_js_1.Client({ intents });
    constructor() {
        this.registerEvents();
    }
    registerEvents() {
        this.client.on('ready', () => this.setup());
        this.client.on('messageCreate', (message) => this.parseMessage(message));
    }
    login(token) {
        this.client.login(token).then(() => console.log('Successfully logged in'));
    }
    setup() {
        const user = this.client.user;
        user.setStatus('online');
        user.setActivity({
            type: 'LISTENING',
            name: 'Gerhard Müller 🙂',
        });
    }
    async parseMessage({ author, channel, member, content, }) {
        if (author.bot)
            return;
        if (!member) {
            channel.send('**I only work in guilds**');
            return;
        }
        if (content.length === 0)
            return;
        if (!content.startsWith(defaultPrefix))
            return;
        const args = content.slice(defaultPrefix.length).split(/ +/);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName)
            return;
        const logger = new command_1.CommandLogger(channel);
        const commandCallInfo = { author, member, args, logger };
        for (const command of commands) {
            if (command.name.toLowerCase() !== commandName)
                continue;
            return await this.tryExecute(channel, command, commandCallInfo);
        }
        for (const command of commands) {
            for (const alias of command.aliases) {
                if (alias.toLowerCase() !== commandName)
                    continue;
                return await this.tryExecute(channel, command, commandCallInfo);
            }
        }
    }
    async tryExecute(channel, command, commandInfo) {
        try {
            await command.execute(commandInfo);
        }
        catch (error) {
            channel.send(`**${error}**`);
            if (!(error instanceof bot_error_1.BotError)) {
                console.log(error);
            }
        }
    }
}
exports.Bot = Bot;
