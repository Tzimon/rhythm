import {
  AudioPlayerStatus,
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { Guild, GuildMember, User, VoiceChannel } from 'discord.js';
import ytdl, { getInfo, validateURL } from 'ytdl-core';
import ytsr, { getFilters } from 'ytsr';
import { IllegalChannelTypeError } from '../errors/illegal-channel-type-error';
import { NoMatchesError } from '../errors/no-matches-error';
import { UserNotConnectedError } from '../errors/user-not-connected-error';
import { VideoUnavailableError } from '../errors/video-unavailable-error';
import { Queue } from './queue';
import { Track } from './track';

const queues = new Map<Guild, Queue>();

export const getQueue = (guild: Guild): Queue => {
  let queue = queues.get(guild);

  if (!queue) {
    queue = new Queue(guild);
    queues.set(guild, queue);
  }

  return queue;
};

export const connect = async (
  channel: VoiceChannel
): Promise<VoiceConnection> => {
  const { guild } = channel;

  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
  });

  connection.on('stateChange', async (_oldState, newState) => {
    if (newState.status === VoiceConnectionStatus.Disconnected)
      disconnect(guild);
  });

  return await entersState(connection, VoiceConnectionStatus.Ready, 30000);
};

export const disconnect = (guild: Guild): void => {
  getVoiceConnection(guild.id)?.destroy();
  getQueue(guild).clear();
};

export const searchTrack = async (
  requester: User,
  query: string
): Promise<Track> => {
  let trackUrl = query;

  if (!validateURL(query)) {
    const searchString = await getFilters(query);
    const videoSearch = searchString.get('Type')!.get('Video')!;

    const result: any = await ytsr(videoSearch.url!, { limit: 1 });
    trackUrl = result.items[0]?.url ?? '';
  }

  if (!validateURL(trackUrl)) throw new NoMatchesError();

  try {
    const info = await getInfo(trackUrl);

    return {
      title: info.videoDetails.title,
      url: trackUrl,
      duration: +info.videoDetails.lengthSeconds,
      channelName: info.videoDetails.ownerChannelName,
      thumbnailUrl: info.videoDetails.thumbnails[0].url,
      requester,
    };
  } catch {
    throw new VideoUnavailableError();
  }
};

export const getVoiceChannel = (member: GuildMember): VoiceChannel => {
  const { voice } = member;
  const { channel } = voice;

  if (!channel) throw new UserNotConnectedError();
  if (!(channel instanceof VoiceChannel)) throw new IllegalChannelTypeError();

  return channel;
};

// export const toggleLoop = async (guild: Guild): Promise<boolean> => {
//   const queue = getQueue(guild);

//   if (queue.loopMode === LoopMode.NO_LOOP) {
//     queue.loopMode = LoopMode.LOOP_SONG;
//     return true;
//   }

//   queue.loopMode = LoopMode.NO_LOOP;
//   return false;
// };

// export const toggleQueueLoop = async (guild: Guild): Promise<boolean> => {
//   const queue = getQueue(guild);

//   if (queue.loopMode === LoopMode.NO_LOOP) {
//     queue.loopMode = LoopMode.LOOP_QUEUE;
//     return true;
//   }

//   queue.loopMode = LoopMode.NO_LOOP;
//   return false;
// };

// export const getCurrentSong = (guild: Guild): Song => {
//   const { playing } = getQueue(guild);

//   if (!playing) throw new NothingPlayingError();

//   return playing.song;
// };

// export const leave = (guild: Guild): void => {
//   if (!getVoiceConnection(guild.id)) throw new NotConnectedError();

//   disconnect(guild);
// };

// // export const seek = (guild: Guild, time: number): void => {
// //   const { playing } = getQueue(guild);

// //   if (!playing) throw new NothingPlayingError();
// // };

// export const setVolume = (guild: Guild, volume: number): void => {
//   const maximum: number = 10000;

//   if (volume <= 0 || volume > maximum) throw new OutOfRangeError(0, maximum);

//   const { playing } = getQueue(guild);

//   if (!playing) throw new NothingPlayingError();

//   playing.resource.volume?.setVolume(volume / 100);
// };
