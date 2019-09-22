'use strict';

const Command = require('../../classes/Command');
const Guild = require('../../classes/Guild');
const S = require('../../classes/Salty');

module.exports = new Command({
    name: 'shuffle',
    keys: [
        "shuffle",
        "mix",
    ],
    help: [
        {
            argument: null,
            effect: "Shuffles the queue"
        },
    ],
    visibility: 'public', 
    action: function (msg, args) {
        let { playlist } = Guild.get(msg.guild.id);

        if (2 < playlist.queue.length) {
            playlist.shuffle();
            S.embed(msg, { title: "queue shuffled !", type: 'success', react: '🔀' });
        } else {
            S.embed(msg, { title: "don't you think you'd need more than 1 song to make it useful ?", type: 'error' });
        }
    },
});

