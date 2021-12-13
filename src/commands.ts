import { MessageEmbed } from 'discord.js';
import { NothingPlayingError, InvalidSyntaxError } from './errors';
import type { Command } from './types/command.type';
import { createCurrentSongEmbed, formatDuration, songAsText } from './utils';
import {
  getCurrentSong,
  getQueue,
  join,
  leave,
  play,
  setVolume,
  skip,
  toggleLoop,
  toggleQueueLoop,
} from './voice/voice-handler';

export const joinCommand: Command = {
  name: 'join',
  aliases: ['j', 'fuckon'],
  execute: async ({ member, channel }) => {
    const voiceChannel = await join(member);
    channel.send(`**👍 Joined \`${voiceChannel.name}\`**`);
  },
};

export const leaveCommand: Command = {
  name: 'leave',
  aliases: ['l', 'disconnect', 'dc', 'fuckoff'],
  execute: async ({ member }) => leave(member.guild),
};

export const playCommand: Command = {
  name: 'play',
  aliases: ['p'],
  execute: async ({ member, args, channel }) => {
    if (args.length <= 0) throw new InvalidSyntaxError();

    const query = args.join(' ');
    const searchingMessage = channel.send(`**🎵 Searching 🔎** \`${query}\``);

    const song = await play(member, query, false);
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
  execute: async ({ member, args, channel }) => {
    if (args.length <= 0) throw new InvalidSyntaxError();

    const query = args.join(' ');
    const searchingMessage = channel.send(`**🎵 Searching 🔎** \`${query}\``);

    const song = await play(member, query, true);
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
  execute: async ({ member, args, channel }) => {
    if (args.length <= 0) throw new InvalidSyntaxError();

    const query = args.join(' ');
    const searchingMessage = channel.send(`**🎵 Searching 🔎** \`${query}\``);

    await skip(member.guild, true);

    const song = await play(member, query, true);
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
  execute: async ({ member, channel }) => {
    await channel.sendTyping();

    await skip(member.guild, false);
    channel.send(`**⏩ Skipped 👍**`);
  },
};

export const loopCommand: Command = {
  name: 'loop',
  aliases: ['lo'],
  execute: async ({ member, channel }) => {
    await channel.sendTyping();

    const enabled = await toggleLoop(member.guild);
    channel.send(`**🔂 ${enabled ? 'Enabled' : 'Disabled'}**`);
  },
};

export const loopQueueCommand: Command = {
  name: 'loopqueue',
  aliases: ['lq'],
  execute: async ({ member, channel }) => {
    await channel.sendTyping();

    const enabled = await toggleQueueLoop(member.guild);
    channel.send(`**🔁 ${enabled ? 'Enabled' : 'Disabled'}**`);
  },
};

export const nowPlayingCommand: Command = {
  name: 'nowplaying',
  aliases: ['np'],
  execute: async ({ member, channel }) => {
    const { guild } = member;

    await channel.sendTyping();

    const currentSong = getCurrentSong(guild);
    channel.send({ embeds: [createCurrentSongEmbed(guild, currentSong)] });
  },
};

export const grabCommand: Command = {
  name: 'grab',
  aliases: [],
  execute: async ({ member }) => {
    const { guild } = member;

    const currentSong = getCurrentSong(guild);
    member.send({ embeds: [createCurrentSongEmbed(guild, currentSong)] });
  },
};

export const queueCommand: Command = {
  name: 'queue',
  aliases: ['q'],
  execute: async ({ member, channel }) => {
    const { guild } = member;

    const { playing, songs } = getQueue(guild);

    if (!playing) throw new NothingPlayingError();

    const { song } = playing;

    const embed = new MessageEmbed()
      .setTitle(`Queue for ${guild.name}`)
      .addField('Now Playing', `[${song.title}](${song.url})`);

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

export const volumeCommand: Command = {
  name: 'volume',
  aliases: ['vol'],
  execute: async ({ args, channel, member }) => {
    const { guild } = member;

    if (args.length !== 1) throw new InvalidSyntaxError();

    const volume: number = +args[0];

    if (!Number.isInteger(volume)) throw new InvalidSyntaxError();

    setVolume(guild, volume);

    channel.send(`**🔊 Set volume to ${volume}%**`);
  },
};
