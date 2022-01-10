"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCommand = void 0;
const audio_handler_1 = require("../audio/audio-handler");
const invalid_syntax_error_1 = require("../errors/invalid-syntax-error");
const empty_queue_error_1 = require("../errors/empty-queue-error");
const out_of_range_error_1 = require("../errors/out-of-range-error");
exports.removeCommand = {
    name: 'remove',
    aliases: [],
    async execute({ args, member, logger }) {
        const { guild } = member;
        if (args.length !== 1)
            throw new invalid_syntax_error_1.InvalidSyntaxError();
        const index = +args[0];
        if (!Number.isInteger(index))
            throw new invalid_syntax_error_1.InvalidSyntaxError();
        const queue = audio_handler_1.getQueue(guild);
        const tracks = queue.tracks;
        const trackCount = tracks.length;
        if (trackCount === 0)
            throw new empty_queue_error_1.EmptyQueueError();
        if (index < 1 || index > trackCount)
            throw new out_of_range_error_1.OutOfRangeError(1, trackCount);
        const track = queue.remove(index - 1);
        await logger.log(`✅ Removed \`${track.title}\``);
    },
};
