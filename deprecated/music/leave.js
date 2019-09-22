'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');

module.exports = new Command({
    name: 'leave',
    keys: [
        "leave",
        "exit",
        "quit",
    ],
    help: [
        {
            argument: null,
            effect: "Leaves the current voice channel"
        },
    ],
    visibility: 'admin', 
    action: function (msg, args) {
        let vcon = msg.guild.voiceConnection;

        if (vcon) {
            let chanName = vcon.channel.name;
            vcon.channel.leave();
            S.embed(msg, { title: `leaving **${ chanName }**`, type: 'success' });
        } else {
            S.embed(msg, { title: "I'm not in a voice channel", type: 'error' });
        }
    },
});

