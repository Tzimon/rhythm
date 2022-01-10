"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopMode = exports.Queue = void 0;
const voice_1 = require("@discordjs/voice");
const ytdl_core_1 = require("ytdl-core");
const audio_handler_1 = require("./audio-handler");
const nothing_playing_error_1 = require("../errors/nothing-playing-error");
const out_of_range_error_1 = require("../errors/out-of-range-error");
class Queue {
    guild;
    tracks = [];
    loopMode = LoopMode.NO_LOOP;
    currentTrack;
    constructor(guild) {
        this.guild = guild;
    }
    clear() {
        this.tracks = [];
        delete this.currentTrack;
    }
    enqueue(track, top) {
        if (top)
            this.tracks.unshift(track);
        else
            this.tracks.push(track);
    }
    async play(channel) {
        if (this.currentTrack)
            return;
        const nextTrack = this.tracks.shift();
        if (!nextTrack) {
            if (channel.members.size === 0)
                return audio_handler_1.disconnect(this.guild);
            setTimeout(() => {
                if (!this.currentTrack)
                    audio_handler_1.disconnect(this.guild), 5 * 60 * 1000;
            });
            return;
        }
        const connection = await audio_handler_1.connect(channel);
        const audioPlayer = voice_1.createAudioPlayer();
        try {
            const stream = ytdl_core_1.default(nextTrack.url, {
                filter: 'audioonly',
                quality: 'highestaudio',
                highWaterMark: 1 << 25,
            });
            const resource = voice_1.createAudioResource(stream, {
                inputType: voice_1.StreamType.Arbitrary,
                inlineVolume: true,
            });
            stream.on('error', () => console.log('Error: stream (queue)'));
            audioPlayer.on('error', () => console.log('Error: audioPlayer (queue)'));
            connection.subscribe(audioPlayer);
            audioPlayer.play(resource);
            await voice_1.entersState(audioPlayer, voice_1.AudioPlayerStatus.Playing, 5000);
            this.currentTrack = { track: nextTrack, audioPlayer, resource };
            audioPlayer.on(voice_1.AudioPlayerStatus.Idle, () => {
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
        }
        catch (e) {
            console.log('error in queue.ts:');
            console.log(e);
        }
    }
    skip(ignoreEmpty) {
        if (!this.currentTrack ||
            this.currentTrack.audioPlayer.state.status !== voice_1.AudioPlayerStatus.Playing) {
            if (!ignoreEmpty)
                throw new nothing_playing_error_1.NothingPlayingError();
            return;
        }
        this.currentTrack.audioPlayer.stop();
    }
    remove(index) {
        return this.tracks.splice(index, 1)[0];
    }
    get playingTrack() {
        if (!this.currentTrack)
            throw new nothing_playing_error_1.NothingPlayingError();
        return this.currentTrack.track;
    }
    set volume(volume) {
        const maximum = 10000;
        if (volume > maximum || volume < 0)
            throw new out_of_range_error_1.OutOfRangeError(0, maximum);
        if (!this.currentTrack)
            throw new nothing_playing_error_1.NothingPlayingError();
        this.currentTrack.resource.volume?.setVolume(volume / 100);
    }
}
exports.Queue = Queue;
var LoopMode;
(function (LoopMode) {
    LoopMode[LoopMode["NO_LOOP"] = 0] = "NO_LOOP";
    LoopMode[LoopMode["LOOP_SONG"] = 1] = "LOOP_SONG";
    LoopMode[LoopMode["LOOP_QUEUE"] = 2] = "LOOP_QUEUE";
})(LoopMode = exports.LoopMode || (exports.LoopMode = {}));
