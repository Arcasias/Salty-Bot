"use strict";

const Command = require("../../classes/Command.js");
const Guild = require("../../classes/Guild.js");
const Salty = require("../../classes/Salty.js");

module.exports = new Command({
    name: "skip",
    keys: ["next"],
    help: [
        {
            argument: null,
            effect: "Skips to the next song",
        },
    ],
    visibility: "public",
    action(msg) {
        const { playlist } = Guild.get(msg.guild.id);

        if (playlist.connection) {
            playlist.skip();
            Salty.success(
                msg,
                `skipped **${
                    playlist.getPlaying().title
                }**, but it was trash anyway`,
                { react: "⏩" }
            );
        } else {
            Salty.error(msg, "I'm not connected to a voice channel");
        }
    },
});
