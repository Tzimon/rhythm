import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  getVoiceConnection,
  joinVoiceChannel,
  StreamType,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { Channel, Guild, GuildMember, User, VoiceChannel } from 'discord.js';
import ytdl, { getInfo, validateURL } from 'ytdl-core';
import ytsr, { getFilters } from 'ytsr';
import {
  IllegalChannelTypeError,
  NoMatchesError,
  NotConnectedError,
  NothingPlayingError,
  OutOfRangeError,
  UserNotConnectedError,
  VideoUnavailableError,
} from '../errors';
import { LoopMode, Queue, Song } from '../types/queue.type';

const queues = new Map<Guild, Queue>();

const connect = async (channel: VoiceChannel): Promise<VoiceConnection> => {
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

const queueSong = (song: Song, guild: Guild, top: boolean): Queue => {
  const queue = getQueue(guild);

  if (top) queue.songs.unshift(song);
  else queue.songs.push(song);

  return queue;
};

export const getQueue = (guild: Guild): Queue => {
  let queue = queues.get(guild);

  if (!queue) {
    queue = {
      songs: [],
      loopMode: LoopMode.NO_LOOP,
    };

    queues.set(guild, queue);
  }

  return queue;
};

const getSong = async (requester: User, query: string): Promise<Song> => {
  let songUrl = query;

  if (!validateURL(query)) songUrl = await searchSong(query);
  if (!validateURL(songUrl)) throw new NoMatchesError();

  try {
    const info = await getInfo(songUrl);

    return {
      title: info.videoDetails.title,
      url: songUrl,
      duration: +info.videoDetails.lengthSeconds,
      channelName: info.videoDetails.ownerChannelName,
      thumbnailUrl: info.videoDetails.thumbnails[0].url,
      requester,
    };
  } catch {
    throw new VideoUnavailableError();
  }
};

const searchSong = async (query: string): Promise<string> => {
  try {
    const searchString = await getFilters(query);
    const videoSearch = searchString.get('Type')!.get('Video')!;

    const result: any = await ytsr(videoSearch.url!, { limit: 1 });
    return result.items[0]?.url ?? '';
  } catch {
    return await searchSong(query);
  }
};

const createStream = (url: string) => {
  while (true) {
    try {
      return ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio',
      });
    } catch {}
  }
};

const playQueue = async (
  guild: Guild,
  channel: VoiceChannel
): Promise<void> => {
  const queue = getQueue(guild);

  const song = queue.songs.shift();

  if (!song) {
    if (channel.members.size === 0) return disconnect(guild);

    setTimeout(() => {
      if (getQueue(guild).playing) disconnect(guild), 5 * 60 * 1000;
    });
    return;
  }

  const connection = await connect(channel);
  const audioPlayer = createAudioPlayer();

  const stream = createStream(song.url);
  const resource = createAudioResource(stream, {
    inputType: StreamType.Arbitrary,
    inlineVolume: true,
  });

  stream.on('error', () => playQueue(guild, channel));

  connection.subscribe(audioPlayer);
  audioPlayer.play(resource);

  await entersState(audioPlayer, AudioPlayerStatus.Playing, 5000);

  queue.playing = { song, audioPlayer, resource };

  audioPlayer.on(AudioPlayerStatus.Idle, () => {
    delete queue.playing;

    switch (queue.loopMode) {
      case LoopMode.LOOP_SONG:
        queue.songs.unshift(song);
        break;
      case LoopMode.LOOP_QUEUE:
        queue.songs.push(song);
        break;
    }

    playQueue(guild, channel);
  });
};

const disconnect = (guild: Guild): void => {
  const connection = getVoiceConnection(guild.id);

  connection?.destroy();

  const queue = getQueue(guild);

  queue.songs = [];
  delete queue.playing;
};

const getVoiceChannel = (member: GuildMember): VoiceChannel => {
  const { voice } = member;
  const { channel } = voice;

  if (!channel) throw new UserNotConnectedError();
  if (!(channel instanceof VoiceChannel)) throw new IllegalChannelTypeError();

  return channel;
};

export const play = async (
  member: GuildMember,
  query: string,
  top: boolean
): Promise<Song> => {
  const { user, guild } = member;

  const channel = getVoiceChannel(member);

  const song = await getSong(user, query);
  const queue = queueSong(song, guild, top);

  if (!queue.playing) await playQueue(guild, channel);

  return song;
};

export const join = async (member: GuildMember): Promise<VoiceChannel> => {
  const channel = getVoiceChannel(member);
  await connect(channel);

  return channel;
};

export const skip = async (
  guild: Guild,
  ignoreEmpty: boolean
): Promise<void> => {
  const { playing } = getQueue(guild);

  if (
    !playing ||
    playing.audioPlayer.state.status !== AudioPlayerStatus.Playing
  ) {
    if (!ignoreEmpty) throw new NothingPlayingError();
    return;
  }

  playing.audioPlayer.stop();
};

export const toggleLoop = async (guild: Guild): Promise<boolean> => {
  const queue = getQueue(guild);

  if (queue.loopMode === LoopMode.NO_LOOP) {
    queue.loopMode = LoopMode.LOOP_SONG;
    return true;
  }

  queue.loopMode = LoopMode.NO_LOOP;
  return false;
};

export const toggleQueueLoop = async (guild: Guild): Promise<boolean> => {
  const queue = getQueue(guild);

  if (queue.loopMode === LoopMode.NO_LOOP) {
    queue.loopMode = LoopMode.LOOP_QUEUE;
    return true;
  }

  queue.loopMode = LoopMode.NO_LOOP;
  return false;
};

export const getCurrentSong = (guild: Guild): Song => {
  const { playing } = getQueue(guild);

  if (!playing) throw new NothingPlayingError();

  return playing.song;
};

export const leave = (guild: Guild): void => {
  if (!getVoiceConnection(guild.id)) throw new NotConnectedError();

  disconnect(guild);
};

// export const seek = (guild: Guild, time: number): void => {
//   const { playing } = getQueue(guild);

//   if (!playing) throw new NothingPlayingError();
// };

export const setVolume = (guild: Guild, volume: number): void => {
  const maximum: number = 10000;

  if (volume <= 0 || volume > maximum) throw new OutOfRangeError(0, maximum);

  const { playing } = getQueue(guild);

  if (!playing) throw new NothingPlayingError();

  playing.resource.volume?.setVolume(volume / 100);
};
