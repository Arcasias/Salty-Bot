import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { clear } from "../../terms";
import { Dictionnary } from "../../types";

const INTERVALS: Dictionnary<NodeJS.Timeout> = {};

Command.register({
    name: "interval",
    category: "text",
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "*delay* ***anything***",
            effect: "I'll tell what you want after a every **delay** seconds",
        },
    ],
    access: "dev",

    async action({ args, msg }) {
        const channel = msg.guild ? msg.guild.id : msg.author.id;
        if (args[0] && clear.includes(args[0])) {
            if (!INTERVALS[channel]) {
                return Salty.warn(msg, "There is no interval on this channel.");
            }
            clearInterval(INTERVALS[channel]);

            Salty.success(msg, "Interval cleared");
        } else {
            if (!args[0]) {
                return Salty.warn(
                    msg,
                    "You need to specify the interval length in milliseconds."
                );
            }
            if (isNaN(Number(args[0]))) {
                return Salty.warn(
                    msg,
                    "You need to specify the interval length in milliseconds."
                );
            }
            if (!args[1]) {
                return Salty.warn(
                    msg,
                    "You need to tell me what to say after each interval."
                );
            }
            const delay = parseInt(args.shift()!) * 1000;

            msg.delete().catch();

            if (INTERVALS[channel]) {
                clearInterval(INTERVALS[channel]);
            }
            INTERVALS[channel] = setInterval(() => {
                Salty.message(msg, args.join(" "));
            }, delay);
        }
    },
});
