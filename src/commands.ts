import { MessageEmbed } from 'discord.js';
import { EmptyQueueError, InvalidSyntaxError } from './errors';
import type { Command } from './types/command.type';
import { createCurrentSongEmbed, formatDuration, songAsText } from './utils';
import {
  getCurrentSong,
  getQueue,
  join,
  leave,
  play,
  skip,
  toggleLoop,
  toggleQueueLoop,
} from './voice/voice-handler';

export const joinCommand: Command = {
  name: 'join',
  aliases: ['j', 'fuckon'],
  execute: async (commandInfo) => {
    const { member, channel } = commandInfo;

    const voiceChannel = await join(member);
    channel.send(`**👍 Joined \`${voiceChannel.name}\`**`);
  },
};

export const leaveCommand: Command = {
  name: 'leave',
  aliases: ['l', 'disconnect', 'dc', 'fuckoff'],
  execute: async (commandInfo) => {
    const { member } = commandInfo;

    leave(member.guild);
  },
};

export const playCommand: Command = {
  name: 'play',
  aliases: ['p'],
  execute: async (commandInfo) => {
    const { member, args, channel } = commandInfo;

    if (args.length <= 0) throw new InvalidSyntaxError();

    const search = args.join(' ');
    const searchingMessage = channel.send(`**🎵 Searching 🔎** \`${search}\``);

    const song = await play(member, search, false);
    const embed = new MessageEmbed()
      .setTitle(song.title)
      .setURL(song.url)
      .addField('Channel', song.channelName, true)
      .addField('Song Duration', formatDuration(song.duration), true)
      .setAuthor('Added to queue')
      .setThumbnail(song.thumbnailUrl);

    searchingMessage.then(() => channel.send({ embeds: [embed] }));
  },
};

export const playTopCommand: Command = {
  name: 'playtop',
  aliases: ['pt'],
  execute: async (commandInfo) => {
    const { member, args, channel } = commandInfo;

    if (args.length <= 0) throw new InvalidSyntaxError();

    const search = args.join(' ');
    const searchingMessage = channel.send(`**🎵 Searching 🔎** \`${search}\``);

    const song = await play(member, search, true);
    const embed = new MessageEmbed()
      .setTitle(song.title)
      .setURL(song.url)
      .addField('Channel', song.channelName, true)
      .addField('Song Duration', formatDuration(song.duration), true)
      .setAuthor('Added to top of queue')
      .setThumbnail(song.thumbnailUrl);

    searchingMessage.then(() => channel.send({ embeds: [embed] }));
  },
};

export const playSkipCommand: Command = {
  name: 'playskip',
  aliases: ['ps'],
  execute: async (commandInfo) => {
    const { member, args, channel } = commandInfo;

    if (args.length <= 0) throw new InvalidSyntaxError();

    const search = args.join(' ');
    const searchingMessage = channel.send(`**🎵 Searching 🔎** \`${search}\``);

    await skip(member.guild);

    const song = await play(member, search, true);
    const embed = new MessageEmbed()
      .setTitle(song.title)
      .setURL(song.url)
      .addField('Channel', song.channelName, true)
      .addField('Song Duration', formatDuration(song.duration), true)
      .setAuthor('Now Playing')
      .setThumbnail(song.thumbnailUrl);

    searchingMessage.then(() => channel.send({ embeds: [embed] }));
  },
};

export const skipCommand: Command = {
  name: 'skip',
  aliases: ['s', 'next'],
  execute: async (commandInfo) => {
    const { member, channel } = commandInfo;

    await channel.sendTyping();

    await skip(member.guild);
    channel.send(`**⏩ Skipped 👍**`);
  },
};

export const loopCommand: Command = {
  name: 'loop',
  aliases: ['l'],
  execute: async (commandInfo) => {
    const { member, channel } = commandInfo;

    await channel.sendTyping();

    const enabled = await toggleLoop(member.guild);
    channel.send(`**🔂 ${enabled ? 'Enabled' : 'Disabled'}**`);
  },
};

export const loopQueueCommand: Command = {
  name: 'loopqueue',
  aliases: ['lq'],
  execute: async (commandInfo) => {
    const { member, channel } = commandInfo;

    await channel.sendTyping();

    const enabled = await toggleQueueLoop(member.guild);
    channel.send(`**🔁 ${enabled ? 'Enabled' : 'Disabled'}**`);
  },
};

export const nowPlayingCommand: Command = {
  name: 'nowplaying',
  aliases: ['np'],
  execute: async (commandInfo) => {
    const { member, channel } = commandInfo;
    const { guild } = member;

    await channel.sendTyping();

    const currentSong = getCurrentSong(guild);
    channel.send({ embeds: [createCurrentSongEmbed(guild, currentSong)] });
  },
};

export const grabCommand: Command = {
  name: 'grab',
  aliases: [],
  execute: async (commandInfo) => {
    const { member } = commandInfo;
    const { guild } = member;

    const currentSong = getCurrentSong(guild);
    member.send({ embeds: [createCurrentSongEmbed(guild, currentSong)] });
  },
};

export const queueCommand: Command = {
  name: 'queue',
  aliases: ['q'],
  execute: async (commandInfo) => {
    const { member, channel } = commandInfo;
    const { guild } = member;

    const { currentSong, songs } = getQueue(guild);

    if (!currentSong) throw new EmptyQueueError();

    const embed = new MessageEmbed()
      .setTitle(`Queue for ${guild.name}`)
      .addField('Now Playing', `[${currentSong.title}](${currentSong.url})`);

    if (songs.length > 0)
      embed.addField(
        'Up Next',
        songs
          .map((song, index) => `\`${index + 1}.\` ${songAsText(song)}`)
          .join('\n\n')
      );

    channel.send({ embeds: [embed] });
  },
};

export const seekCommand: Command = {
  name: 'seek',
  aliases: ['sk'],
  execute: async (commandInfo) => {
    const { args } = commandInfo;

    if (args.length !== 1) throw new InvalidSyntaxError();
  },
};
