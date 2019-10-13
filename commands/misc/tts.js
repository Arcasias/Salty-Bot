'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');
const error = require('../../classes/Exception');

module.exports = new Command({
    name: 'tts',
    keys: [
        "tts",
        "speak",
    ],
    help: [
        {
            argument: null,
            effect: null
        },
        {
            argument: "***something to say***",
            effect: "Says something out loud"
        },
    ],
    visibility: 'public', 
    action: async function (msg, args) {

        // Just sends the arguments as a TTS message
        if (!args[0]) {
            throw new error.MissingArg("message");
        }
        msg.delete();
        await msg.channel.send(args.join(" "), { tts: true });
    },
});

