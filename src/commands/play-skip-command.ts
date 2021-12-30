import { MessageEmbed } from 'discord.js';
import { getQueue, getVoiceChannel, searchTrack } from '../audio/audio-handler';
import { Command } from '../core/command';
import { formatDuration } from '../core/tools';
import { InvalidSyntaxError } from '../errors/invalid-syntax-error';

export const playSkipCommand: Command = {
  name: 'playskip',
  aliases: ['ps'],
  async execute({ member, args, logger }) {
    const { guild, user } = member;
    const channel = getVoiceChannel(member);

    if (args.length <= 0) throw new InvalidSyntaxError();

    const query = args.join(' ');
    const searchingMessage = logger.logNative(
      `**🎵 Searching 🔎** \`${query}\``
    );

    const queue = getQueue(guild);
    queue.skip(true);

    const track = await searchTrack(user, query);
    queue.enqueue(track, true);
    await queue.play(channel);

    const embed = new MessageEmbed();

    embed.setTitle(track.title);
    embed.setURL(track.url);
    embed.addField('Channel', track.channelName, true);
    embed.addField('Song Duration', formatDuration(track.duration), true);
    embed.setAuthor('Now Playing');
    embed.setThumbnail(track.thumbnailUrl);

    await searchingMessage;
    await logger.log('', embed);
  },
};
