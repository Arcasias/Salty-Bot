"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Guild_1 = __importDefault(require("../../classes/Guild"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const User_1 = __importDefault(require("../../classes/User"));
const config_1 = require("../../config");
exports.default = new Command_1.default({
    name: "state",
    keys: ["git", "instance", "local", "server"],
    help: [
        {
            argument: null,
            effect: "Gets you some information about me",
        },
    ],
    visibility: "dev",
    async action({ msg }) {
        const options = {
            title: `Salty Bot`,
            url: config_1.homepage,
            description: `Last started on ${Salty_1.default.startTime.toString().split(" GMT")[0]}`,
            fields: [
                {
                    name: `Hosted on`,
                    value: process.env.MODE === "server"
                        ? "Server"
                        : "Local instance",
                },
                { name: `Owner`, value: config_1.owner.username },
                {
                    name: `Servers`,
                    value: `Running on ${Guild_1.default.size} servers`,
                },
                { name: `Users`, value: `Handling ${User_1.default.size} users` },
                {
                    name: `Developers`,
                    value: `${config_1.devs.length} contributors`,
                },
                {
                    name: `Blacklist`,
                    value: `${User_1.default.filter((u) => u.black_listed).length} troublemakers`,
                },
            ],
            inline: true,
        };
        if (process.env.DEBUG === "true") {
            options.footer = { text: `Debug mode active` };
        }
        await Salty_1.default.embed(msg, options);
    },
});
