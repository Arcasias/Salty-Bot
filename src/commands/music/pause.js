"use strict";

const Command = require("../../classes/Command.js");
const Guild = require("../../classes/Guild.js");
const Salty = require("../../classes/Salty.js");

module.exports = new Command({
    name: "pause",
    keys: ["freeze"],
    help: [
        {
            argument: null,
            effect: "Pauses the song currently playing",
        },
    ],
    visibility: "public",
    action(msg) {
        const { playlist } = Guild.get(msg.guild.id);

        if (playlist.connection) {
            try {
                playlist.pause();
                Salty.success(msg, `paused **${playlist.playing.title}**`, {
                    react: "⏸",
                });
            } catch (err) {
                Salty.error(msg, "the song is already paused");
            }
        } else {
            Salty.error(msg, "there's nothing playing");
        }
    },
});
