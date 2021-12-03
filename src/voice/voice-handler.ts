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
import { Guild, GuildMember, User, VoiceChannel } from 'discord.js';
import ytdl, { getInfo, validateURL } from 'ytdl-core';
import ytsr, { getFilters } from 'ytsr';
import {
  EmptyQueueError,
  IllegalChannelTypeError,
  NoMatchesError,
  NotConnectedError,
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

const getSong = async (requester: User, search: string): Promise<Song> => {
  let songUrl = search;

  if (!validateURL(search)) {
    const searchString = await getFilters(search);
    const videoSearch = searchString.get('Type')!.get('Video')!;

    const result: any = await ytsr(videoSearch.url!, { limit: 1 });
    songUrl = result.items[0]?.url ?? '';
  }

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

const playQueue = async (
  guild: Guild,
  channel: VoiceChannel
): Promise<void> => {
  const queue = getQueue(guild);

  const song = queue.songs.shift();

  if (!song) {
    if (channel.members.size === 0) return disconnect(guild);

    setTimeout(() => queue.songs.length === 0 && disconnect(guild), 5000 * 60);
    return;
  }

  const connection = await connect(channel);
  const audioPlayer = createAudioPlayer();
  const stream = ytdl(song.url, {
    filter: 'audioonly',
    quality: 'highestaudio',
    highWaterMark: 1 << 25,
  });
  const resource = createAudioResource(stream, {
    inputType: StreamType.Arbitrary,
  });

  queue.audioPlayer = audioPlayer;

  stream.on('error', () => playQueue(guild, channel));

  connection.subscribe(audioPlayer);
  audioPlayer.play(resource);

  connection.receiver.subscribe;

  await entersState(audioPlayer, AudioPlayerStatus.Playing, 5000);

  queue.currentSong = song;

  audioPlayer.on(AudioPlayerStatus.Idle, () => {
    delete queue.currentSong;

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
  delete queue.currentSong;
  delete queue.audioPlayer;
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
  search: string,
  top: boolean
): Promise<Song> => {
  const { user, guild } = member;

  const channel = getVoiceChannel(member);

  const song = await getSong(user, search);
  const queue = queueSong(song, guild, top);

  if (!queue.currentSong) await playQueue(guild, channel);

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
  const { audioPlayer } = getQueue(guild);

  if (
    !ignoreEmpty &&
    (!audioPlayer || audioPlayer.state.status !== AudioPlayerStatus.Playing)
  )
    throw new EmptyQueueError();

  audioPlayer.stop();
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
  const { currentSong } = getQueue(guild);

  if (!currentSong) throw new EmptyQueueError();

  return currentSong;
};

export const leave = (guild: Guild): void => {
  if (!getVoiceConnection(guild.id)) throw new NotConnectedError();

  disconnect(guild);
};
