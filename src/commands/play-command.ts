import { MessageEmbed } from 'discord.js';
import { getQueue, getVoiceChannel, searchTrack } from '../audio/audio-handler';
import { Command, CommandCallInfo } from '../core/command';
import { InvalidSyntaxError } from '../errors/invalid-syntax-error';
import { formatDuration } from '../core/tools';

export const playCommand: Command = {
  name: 'play',
  aliases: ['p'],
  async execute({ args, member, logger }) {
    const { user, guild } = member;
    const channel = getVoiceChannel(member);

    if (args.length <= 0) throw new InvalidSyntaxError();

    const query = args.join(' ');
    const searchingMessage = logger.logNative(
      `**🎵 Searching 🔎** \`${query}\``
    );

    const track = await searchTrack(user, query);
    const queue = getQueue(guild);

    queue.enqueue(track, false);
    await queue.play(channel);

    const embed = new MessageEmbed();

    embed.setTitle(track.title);
    embed.setURL(track.url);
    embed.addField('Channel', track.channelName, true);
    embed.addField('Song Duration', formatDuration(track.duration), true);
    embed.setAuthor('Added to queue');
    embed.setThumbnail(track.thumbnailUrl);

    await searchingMessage;
    await logger.log('', embed);
  },
};
