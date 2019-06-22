'use strict';

const Command = require('../../classes/Command');
const Guild = require('../../classes/Guild');
const S = require('../../classes/Salty');

module.exports = new Command({
    name: 'skip',
    keys: [
        "skip",
        "next",
    ],
    help: [
        {
            argument: null,
            effect: "Skips to the next song"
        },
    ],
    visibility: 'public', 
    action: function (msg, args) {
        let { playlist } = Guild.get(msg.guild.id);
        let vcon = msg.guild.voiceConnection;

        if (vcon) {
            if (S.isAdmin(msg.author, msg.guild) || playlist.pointer + 1 in playlist.queue) {
                S.embed(msg, { title: `skipped **${playlist.getPlaying().title}**, but it was trash anyway`, type: 'success', react: '⏩' });

                if ('single' === playlist.repeat) {
                    playlist.pointer ++;
                }
                vcon.dispatcher.end();
            } else { 
                S.embed(msg, { title: "you're not in the admin list", type: 'error' });
            }
        } else {
            S.embed(msg, { title: "I'm not connected to a voice channel", type: 'error' });
        }
    },
});

