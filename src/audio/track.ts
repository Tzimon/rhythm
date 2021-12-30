import { AudioPlayer, AudioResource } from '@discordjs/voice';
import { User } from 'discord.js';

export interface Track {
  title: string;
  url: string;
  duration: number;
  channelName: string;
  thumbnailUrl: string;
  requester: User;
}

export interface CurrentTrackInfo {
  track: Track;
  audioPlayer: AudioPlayer;
  resource: AudioResource;
}
