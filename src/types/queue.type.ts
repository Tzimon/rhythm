import { AudioPlayer, AudioResource } from '@discordjs/voice';
import { User } from 'discord.js';

export interface Queue {
  songs: Array<Song>;
  loopMode: LoopMode;
  playing?: CurrentSongInfo;
}

export interface Song {
  title: string;
  url: string;
  duration: number;
  channelName: string;
  thumbnailUrl: string;
  requester: User;
}

export interface CurrentSongInfo {
  song: Song;
  audioPlayer: AudioPlayer;
  resource: AudioResource;
}

export enum LoopMode {
  NO_LOOP,
  LOOP_SONG,
  LOOP_QUEUE,
}
