"use strict";

const Command = require("../../classes/Command.js");
const Salty = require("../../classes/Salty.js");

module.exports = new Command({
    name: "disconnect",
    keys: [],
    help: [
        {
            argument: null,
            effect:
                "Disconnects me and terminates my program. Think wisely before using this one, ok ?",
        },
    ],
    visibility: "dev",
    async action() {
        await Salty.success(
            `${UTIL.choice(Salty.getList("answers")["bye"])} ♥`
        );
        await Salty.destroy();
    },
});
