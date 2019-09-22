'use strict';

const Command = require('../../classes/Command');
const Guild = require('../../classes/Guild');
const S = require('../../classes/Salty');

module.exports = new Command({
    name: 'resume',
    keys: [
        "resume",
        "unfreeze",
    ],
    help: [
        {
            argument: null,
            effect: "Resumes the paused song"
        },
    ],
    visibility: 'public', 
    action: function (msg, args) {
        let { playlist } = Guild.get(msg.guild.id);
        let vcon = msg.guild.voiceConnection;
        
        if (vcon) {
            if (vcon.dispatcher.paused) {
                S.embed(msg, { title: `resumed **${playlist.getPlaying().title}**`, type: 'success', react: '▶' });
                vcon.dispatcher.resume();
            } else {
                S.embed(msg, { title: "the song isn't paused", type: 'error' });
            }
        } else {
            S.embed(msg, { title: "there's nothing playing", type: 'error' });
        }
    },
});

