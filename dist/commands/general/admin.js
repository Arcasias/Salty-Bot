"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
Command_1.default.register({
    name: "admin",
    aliases: ["administrator"],
    category: "general",
    channel: "guild",
    help: [
        {
            argument: null,
            effect: "Tells you wether you're an admin",
        },
        {
            argument: "***mention***",
            effect: "Tells you wether the ***mention*** is an admin",
        },
    ],
    async action({ msg, target }) {
        const isRequestedUserAdmin = utils_1.isAdmin(target.user, msg.guild);
        Salty_1.default.message(msg, target.isMention
            ?
                target.user.id === Salty_1.default.bot.user.id
                    ?
                        isRequestedUserAdmin
                            ?
                                "of course I'm an admin ;)"
                            :
                                "nope, I'm not an admin on this server :c"
                    :
                        isRequestedUserAdmin
                            ?
                                "<mention> is a wise and powerful admin"
                            :
                                "<mention> is not an admin"
            :
                isRequestedUserAdmin
                    ?
                        "you have been granted the administrators permissions. May your deeds be blessed forever!"
                    :
                        "nope, you're not an admin");
    },
});
