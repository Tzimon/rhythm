import { MessageEmbed } from 'discord.js';
import type { Command } from './types/command.type';
import { createCurrentSongEmbed, getDurationFormatted } from './utils';
import {
  getCurrentSong,
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

    await channel.sendTyping();

    try {
      const voiceChannel = await join(member);
      channel.send(`**👍 Joined \`${voiceChannel.name}\`**`);
    } catch (error) {
      channel.send(`**❌ ${error}**`);
    }
  },
};

export const leaveCommand: Command = {
  name: 'leave',
  aliases: ['l', 'disconnect', 'dc', 'fuckoff'],
  execute: (commandInfo) => {
    const { member, channel } = commandInfo;

    try {
      leave(member.guild);
    } catch (error) {
      channel.send(`**❌ ${error}**`);
    }
  },
};

export const playCommand: Command = {
  name: 'play',
  aliases: ['p'],
  execute: async (commandInfo) => {
    const { member, args, channel } = commandInfo;

    const search = args.join(' ');
    const searchingMessage = channel.send(`**🎵 Searching 🔎** \`${search}\``);

    try {
      const song = await play(member, search);
      const embed = new MessageEmbed()
        .setTitle(song.title)
        .setURL(song.url)
        .addField('Channel', song.channelName, true)
        .addField('Song Duration', getDurationFormatted(song.duration), true)
        .setAuthor('Added to queue')
        .setThumbnail(song.thumbnailUrl);

      searchingMessage.then(() => channel.send({ embeds: [embed] }));
    } catch (error) {
      channel.send(`**❌ ${error}**`);
    }
  },
};

export const skipCommand: Command = {
  name: 'skip',
  aliases: ['s', 'next'],
  execute: async (commandInfo) => {
    const { member, channel } = commandInfo;

    await channel.sendTyping();

    try {
      await skip(member.guild);
      channel.send(`**⏩ Skipped 👍**`);
    } catch (error) {
      channel.send(`**❌ ${error}**`);
    }
  },
};

export const loopCommand: Command = {
  name: 'loop',
  aliases: ['l'],
  execute: async (commandInfo) => {
    const { member, channel } = commandInfo;

    await channel.sendTyping();

    try {
      const enabled = await toggleLoop(member.guild);
      channel.send(`**🔂 ${enabled ? 'Enabled' : 'Disabled'}**`);
    } catch (error) {
      channel.send(`**❌ ${error}**`);
    }
  },
};

export const loopQueueCommand: Command = {
  name: 'loopqueue',
  aliases: ['lq'],
  execute: async (commandInfo) => {
    const { member, channel } = commandInfo;

    await channel.sendTyping();

    try {
      const enabled = await toggleQueueLoop(member.guild);
      channel.send(`**🔁 ${enabled ? 'Enabled' : 'Disabled'}**`);
    } catch (error) {
      channel.send(`**❌ ${error}**`);
    }
  },
};

export const nowPlayingCommand: Command = {
  name: 'nowplaying',
  aliases: ['np'],
  execute: async (commandInfo) => {
    const { member, channel } = commandInfo;
    const { guild } = member;

    await channel.sendTyping();

    try {
      const currentSong = getCurrentSong(guild);
      channel.send({ embeds: [createCurrentSongEmbed(guild, currentSong)] });
    } catch (error) {
      channel.send(`**❌ ${error}**`);
    }
  },
};

export const grabCommand: Command = {
  name: 'grab',
  aliases: [],
  execute: async (commandInfo) => {
    const { member, channel } = commandInfo;
    const { guild } = member;

    try {
      const currentSong = getCurrentSong(guild);
      member.send({ embeds: [createCurrentSongEmbed(guild, currentSong)] });
    } catch (error) {
      channel.send(`**❌ ${error}**`);
    }
  },
};
