"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
exports.default = new Command_1.default({
    name: "admin",
    keys: ["admins", "administrator", "administrators"],
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
    visibility: "public",
    async action({ msg, target }) {
        const isRequestedUserAdmin = Salty_1.default.isAdmin(target.user, msg.guild);
        await Salty_1.default.message(msg, target.isMention
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
