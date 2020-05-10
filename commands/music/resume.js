'use strict';

const Command = require('../../classes/Command.js');
const Guild = require('../../classes/Guild.js');
const Salty = require('../../classes/Salty.js');

module.exports = new Command({
    name: 'resume',
    keys: [
        "unfreeze",
    ],
    help: [
        {
            argument: null,
            effect: "Resumes the paused song"
        },
    ],
    visibility: 'public',
    action(msg) {
        const { playlist } = Guild.get(msg.guild.id);

        if (playlist.connection) {
            try {
                playlist.resume();
                Salty.success(msg, `resumed **${playlist.playing.title}**`, { react: '▶' });
            } catch (err) {
                Salty.error(msg, "the song isn't paused");
            }
        } else {
            Salty.error(msg, "there's nothing playing");
        }
    },
});
