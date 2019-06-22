'use strict';

const Command = require('../../classes/Command');
const Guild = require('../../classes/Guild');
const S = require('../../classes/Salty');

module.exports = new Command({
    name: 'stop',
    keys: [
        "stop",
    ],
    help: [
        {
            argument: null,
            effect: "Leaves the voice channel and deletes the queue"
        },
    ],
    visibility: 'admin', 
    action: function (msg, args) {
        let { playlist } = Guild.get(msg.guild.id);
        let vcon = msg.guild.voiceConnection;

        if (playlist.queue[0]) {
            if (vcon) {
                vcon.channel.leave();
            }
            playlist.queueClear();
            S.embed(msg, {
                title: UTIL.choice(S.getList('answers')['bye']),
                type: 'success',
                react: '⏹',
            });
        } else {
            S.embed(msg, {
                title: "I'm not in a voice channel",
                type: 'error',
            });
        }
    },
});

