"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVoiceChannel = exports.searchTrack = exports.disconnect = exports.connect = exports.getQueue = void 0;
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
const ytdl_core_1 = require("ytdl-core");
const ytsr_1 = require("ytsr");
const illegal_channel_type_error_1 = require("../errors/illegal-channel-type-error");
const no_matches_error_1 = require("../errors/no-matches-error");
const user_not_connected_error_1 = require("../errors/user-not-connected-error");
const video_unavailable_error_1 = require("../errors/video-unavailable-error");
const queue_1 = require("./queue");
const queues = new Map();
const getQueue = (guild) => {
    let queue = queues.get(guild);
    if (!queue) {
        queue = new queue_1.Queue(guild);
        queues.set(guild, queue);
    }
    return queue;
};
exports.getQueue = getQueue;
const connect = async (channel) => {
    const { guild } = channel;
    const connection = voice_1.joinVoiceChannel({
        channelId: channel.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
    });
    connection.on('stateChange', async (_oldState, newState) => {
        if (newState.status === voice_1.VoiceConnectionStatus.Disconnected)
            exports.disconnect(guild);
    });
    return await voice_1.entersState(connection, voice_1.VoiceConnectionStatus.Ready, 30000);
};
exports.connect = connect;
const disconnect = (guild) => {
    voice_1.getVoiceConnection(guild.id)?.destroy();
    exports.getQueue(guild).clear();
};
exports.disconnect = disconnect;
const searchTrack = async (requester, query) => {
    let trackUrl = query;
    if (!ytdl_core_1.validateURL(query)) {
        const searchString = await ytsr_1.getFilters(query);
        const videoSearch = searchString.get('Type').get('Video');
        const result = await ytsr_1.default(videoSearch.url, { limit: 1 });
        trackUrl = result.items[0]?.url ?? '';
    }
    if (!ytdl_core_1.validateURL(trackUrl))
        throw new no_matches_error_1.NoMatchesError();
    try {
        const info = await ytdl_core_1.getInfo(trackUrl);
        return {
            title: info.videoDetails.title,
            url: trackUrl,
            duration: +info.videoDetails.lengthSeconds,
            channelName: info.videoDetails.ownerChannelName,
            thumbnailUrl: info.videoDetails.thumbnails[0].url,
            requester,
        };
    }
    catch {
        throw new video_unavailable_error_1.VideoUnavailableError();
    }
};
exports.searchTrack = searchTrack;
const getVoiceChannel = (member) => {
    const { voice } = member;
    const { channel } = voice;
    if (!channel)
        throw new user_not_connected_error_1.UserNotConnectedError();
    if (!(channel instanceof discord_js_1.VoiceChannel))
        throw new illegal_channel_type_error_1.IllegalChannelTypeError();
    return channel;
};
exports.getVoiceChannel = getVoiceChannel;
