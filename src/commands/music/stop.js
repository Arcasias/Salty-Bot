"use strict";

const Command = require("../../classes/Command.js");
const Guild = require("../../classes/Guild.js");
const Salty = require("../../classes/Salty.js");

module.exports = new Command({
    name: "stop",
    keys: [],
    help: [
        {
            argument: null,
            effect: "Leaves the voice channel and deletes the queue",
        },
    ],
    visibility: "admin",
    action(msg) {
        const { playlist } = Guild.get(msg.guild.id);

        if (playlist.connection) {
            playlist.stop();
            Salty.success(msg, UTIL.choice(Salty.getList("answers")["bye"]), {
                react: "⏹",
            });
        } else {
            Salty.error(msg, "I'm not in a voice channel");
        }
    },
});
