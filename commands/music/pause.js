'use strict';

const Command = require('../../classes/Command');
const Guild = require('../../classes/Guild');
const S = require('../../classes/Salty');

module.exports = new Command({
    name: 'pause',
    keys: [
        "pause",
        "freeze",
    ],
    help: [
        {
            argument: null,
            effect: "Pauses the song currently playing"
        },
    ],
    visibility: 'public', 
    action: function (msg, args) {
        const vcon = msg.guild.voiceConnection;

        if (vcon) {
            S.embed(msg, { title: `paused **${ Guild.get(msg.guild.id).playlist.getPlaying().title }**`, type: 'success', react: '⏸' });

            vcon.dispatcher.pause();
        } else {
            S.embed(msg, { title: "there's nothing playing", type: 'error' });
        }
    },
});

