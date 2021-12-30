import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  StreamType,
} from '@discordjs/voice';
import { Guild, VoiceChannel } from 'discord.js';
import ytdl from 'ytdl-core';
import { connect, disconnect } from './audio-handler';
import { CurrentTrackInfo, Track } from './track';
import { NothingPlayingError } from '../errors/nothing-playing-error';

export class Queue {
  private tracks: Array<Track> = [];
  private currentTrack?: CurrentTrackInfo;
  public loopMode: LoopMode = LoopMode.NO_LOOP;

  public constructor(private readonly guild: Guild) {}

  public clear(): void {
    this.tracks = [];
    delete this.currentTrack;
  }

  public enqueue(track: Track, top: boolean): void {
    if (top) this.tracks.unshift(track);
    else this.tracks.push(track);
  }

  public async play(channel: VoiceChannel): Promise<void> {
    const nextTrack = this.tracks.shift();

    if (!nextTrack) {
      if (channel.members.size === 0) return disconnect(this.guild);

      setTimeout(() => {
        if (!this.currentTrack) disconnect(this.guild), 5 * 60 * 1000;
      });

      return;
    }

    const connection = await connect(channel);
    const audioPlayer = createAudioPlayer();

    try {
      const stream = ytdl(nextTrack.url, {
        filter: 'audioonly',
        quality: 'highestaudio',
      });

      const resource = createAudioResource(stream, {
        inputType: StreamType.Arbitrary,
        inlineVolume: true,
      });

      stream.on('error', () => this.play(channel));

      connection.subscribe(audioPlayer);
      audioPlayer.play(resource);

      await entersState(audioPlayer, AudioPlayerStatus.Playing, 5000);
      this.currentTrack = { track: nextTrack, audioPlayer, resource };

      audioPlayer.on(AudioPlayerStatus.Idle, () => {
        delete this.currentTrack;

        switch (this.loopMode) {
          case LoopMode.LOOP_SONG:
            this.tracks.unshift(nextTrack);
            break;
          case LoopMode.LOOP_QUEUE:
            this.tracks.push(nextTrack);
            break;
        }

        this.play(channel);
      });
    } catch (e) {
      console.log('error in queue.ts:');
      console.log(e);
    }
  }

  public skip(ignoreEmpty: boolean): void {
    if (
      !this.currentTrack ||
      this.currentTrack.audioPlayer.state.status !== AudioPlayerStatus.Playing
    ) {
      if (!ignoreEmpty) throw new NothingPlayingError();
      return;
    }

    this.currentTrack.audioPlayer.stop();
  }

  public get playingTrack(): Track {
    if (!this.currentTrack) throw new NothingPlayingError();
    return this.currentTrack.track;
  }
}

export enum LoopMode {
  NO_LOOP,
  LOOP_SONG,
  LOOP_QUEUE,
}
