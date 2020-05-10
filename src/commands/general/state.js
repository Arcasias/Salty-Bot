"use strict";

const Command = require("../../classes/Command.js");
const Guild = require("../../classes/Guild.js");
const Salty = require("../../classes/Salty.js");
const User = require("../../classes/User.js");

module.exports = new Command({
    name: "state",
    keys: ["git", "instance", "local", "server"],
    help: [
        {
            argument: null,
            effect: "Gets you some information about me",
        },
    ],
    visibility: "dev",
    async action(msg) {
        const options = {
            title: `Salty Bot`,
            url: Salty.config.homepage,
            description: `Last started on ${
                Salty.startTime.toString().split(" GMT")[0]
            }`,
            fields: [
                {
                    title: `Hosted on`,
                    description:
                        process.env.MODE === "server"
                            ? "Server"
                            : "Local instance",
                },
                { title: `Owner`, description: Salty.config.owner.username },
                {
                    title: `Servers`,
                    description: `Running on ${Guild.size} servers`,
                },
                { title: `Users`, description: `Handling ${User.size} users` },
                {
                    title: `Developers`,
                    description: `${Salty.config.devs.length} contributors`,
                },
                {
                    title: `Blacklist`,
                    description: `${
                        User.filter((u) => u.black_listed).length
                    } troublemakers`,
                },
            ],
            inline: true,
        };
        if (process.env.DEBUG === "true") {
            options.footer = `Debug mode active`;
        }
        await Salty.embed(msg, options);
    },
});
