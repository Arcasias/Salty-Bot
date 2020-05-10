'use strict';

const Command = require('../../classes/Command.js');
const Guild = require('../../classes/Guild.js');
const Salty = require('../../classes/Salty.js');

module.exports = new Command({
    name: 'shuffle',
    keys: [
        "mix",
    ],
    help: [
        {
            argument: null,
            effect: "Shuffles the queue"
        },
    ],
    visibility: 'public',
    action(msg) {
        const { playlist } = Guild.get(msg.guild.id);

        if (playlist.queue.length > 2) {
            playlist.shuffle();
            Salty.success(msg, "queue shuffled !", { react: '🔀' });
        } else {
            Salty.error(msg, "don't you think you'd need more than 1 song to make it useful ?");
        }
    },
});
