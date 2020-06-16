"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const User_1 = __importDefault(require("../../classes/User"));
const config_1 = require("../../config");
const salty_1 = __importDefault(require("../../salty"));
Command_1.default.register({
    name: "state",
    aliases: ["git", "local", "server"],
    category: "general",
    help: [
        {
            argument: null,
            effect: "Gets you some information about me",
        },
    ],
    access: "dev",
    async action({ msg }) {
        const blacklist = User_1.default.filter((u) => u.black_listed);
        const options = {
            title: `Salty Bot`,
            url: config_1.homepage,
            description: `Last started on ${salty_1.default.startTime.toString().split(" GMT")[0]}`,
            fields: [
                {
                    name: `Hosted on`,
                    value: process.env.MODE === "server"
                        ? "Server"
                        : "Local instance",
                },
                { name: `Owner`, value: config_1.owner.username },
                { name: `Developers`, value: `${config_1.devs.length} contributors` },
                {
                    name: `Servers`,
                    value: `Handling ${Guild_1.default.size} servers`,
                },
                { name: `Users`, value: `Handling ${User_1.default.size} users` },
            ],
            inline: true,
        };
        if (blacklist.length) {
            options.fields.push({
                name: `Blacklist`,
                value: `${blacklist.length} troublemakers`,
            });
        }
        if (process.env.DEBUG === "true") {
            options.footer = { text: `Debug mode active` };
        }
        await salty_1.default.embed(msg, options);
    },
});
