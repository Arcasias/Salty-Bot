"use strict";

const Command = require("../../classes/Command.js");
const Salty = require("../../classes/Salty.js");

module.exports = new Command({
    name: "restart",
    keys: ["reset"],
    help: [
        {
            argument: null,
            effect: "Disconnects me and reconnects right after",
        },
    ],
    visibility: "dev",
    async action(msg) {
        await Salty.success(msg, "Restarting ...");
        await Salty.restart();
    },
});
