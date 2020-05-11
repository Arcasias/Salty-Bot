import Command from "../../classes/Command";
import {
    EmptyObject,
    IncorrectValue,
    MissingArg,
} from "../../classes/Exception";
import Salty from "../../classes/Salty";

const INTERVALS = {};

export default new Command({
    name: "interval",
    keys: [],
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
    visibility: "dev",
    async action(msg, args) {
        if (args[0] && Salty.getList("clear").includes(args[0])) {
            if (!INTERVALS[msg.guild.id]) {
                throw new EmptyObject("interval");
            }
            clearInterval(INTERVALS[msg.guild.id]);

            Salty.success(msg, "Interval cleared");
        } else {
            if (!args[0]) {
                throw new MissingArg("delay");
            }
            if (isNaN(args[0])) {
                throw new IncorrectValue("delay", "number");
            }
            if (!args[1]) {
                throw new MissingArg("message");
            }
            const delay = parseInt(args.shift()) * 1000;

            msg.delete().catch();

            if (INTERVALS[msg.guild.id]) {
                clearInterval(INTERVALS[msg.guild.id]);
            }
            INTERVALS[msg.guild.id] = setInterval(() => {
                Salty.message(msg, args.join(" "));
            }, delay);
        }
    },
});
