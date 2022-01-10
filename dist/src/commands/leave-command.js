"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveCommand = void 0;
const audio_handler_1 = require("../audio/audio-handler");
exports.leaveCommand = {
    name: 'leave',
    aliases: ['l', 'disconnect', 'dc', 'disc', 'fuckoff'],
    execute: async ({ member }) => audio_handler_1.disconnect(member.guild),
};
