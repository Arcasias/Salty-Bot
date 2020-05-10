"use strict";

const Command = require("../../classes/Command.js");
const Guild = require("../../classes/Guild.js");
const Salty = require("../../classes/Salty.js");

module.exports = new Command({
    name: "leave",
    keys: ["exit", "quit"],
    help: [
        {
            argument: null,
            effect: "Leaves the current voice channel",
        },
    ],
    visibility: "admin",
    action(msg) {
        const { playlist } = Guild.get(msg.guild.id);

        if (playlist.connection) {
            playlist.end();
            Salty.success(msg, `leaving **${chanName}**`);
        } else {
            Salty.error(msg, "I'm not in a voice channel");
        }
    },
});
