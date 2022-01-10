"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.volumeCommand = void 0;
const audio_handler_1 = require("../audio/audio-handler");
const invalid_syntax_error_1 = require("../errors/invalid-syntax-error");
exports.volumeCommand = {
    name: 'volume',
    aliases: ['vol'],
    async execute({ args, member, logger }) {
        const { guild } = member;
        if (args.length !== 1)
            throw new invalid_syntax_error_1.InvalidSyntaxError();
        const volume = +args[0];
        if (!Number.isInteger(volume))
            throw new invalid_syntax_error_1.InvalidSyntaxError();
        const queue = audio_handler_1.getQueue(guild);
        queue.volume = volume;
        await logger.log(`🔊 Set volume to ${volume}%`);
    },
};
