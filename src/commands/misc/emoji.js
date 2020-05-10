"use strict";

const Command = require("../../classes/Command.js");
const Salty = require("../../classes/Salty.js");
const fs = require("fs");

const emojiPath = "./assets/img/saltmoji";

module.exports = new Command({
    name: "emoji",
    keys: ["emojis", "saltmoji", "saltmojis"],
    help: [
        {
            argument: null,
            effect: "Shows my emojis list",
        },
        {
            argument: "***emoji name***",
            effect: "Sends the indicated emoji",
        },
    ],
    visibility: "public",
    async action(msg, args) {
        fs.readdir(emojiPath, (error, files) => {
            if (error) {
                return LOG.error(error);
            }
            let pngs = files.filter((file) => file.split(".").pop() === "png");
            let emojiNames = pngs.map((name) => name.split(".").shift());

            if (args[0]) {
                let arg = args[0].toLowerCase();
                let emoji = false;

                if ("rand" === arg || "random" === arg) {
                    emoji = UTIL.choice(emojiNames);
                } else if (emojiNames.includes(arg)) {
                    emoji = arg;
                }
                if (emoji) {
                    msg.delete();
                    return msg.channel.send({
                        files: [`${emojiPath}/${emoji}.png`],
                    });
                }
            }
            Salty.embed(msg, {
                title: "list of saltmojis",
                description: emojiNames.join("\n"),
            });
        });
    },
});
