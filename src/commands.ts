import { MessageEmbed } from 'discord.js';
import type { Command } from './types/command.type';
import {
  createCurrentSongEmbed,
  getDurationFormatted,
  songAsText,
} from './utils';
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

    if (args.length <= 0) throw 'Invalid syntax';

    const search = args.join(' ');
    const searchingMessage = channel.send(`**🎵 Searching 🔎** \`${search}\``);

    const song = await play(member, search);
    const embed = new MessageEmbed()
      .setTitle(song.title)
      .setURL(song.url)
      .addField('Channel', song.channelName, true)
      .addField('Song Duration', getDurationFormatted(song.duration), true)
      .setAuthor('Added to queue')
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

    if (!currentSong) throw 'Nothing playing in your server';

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
