import Command from "../../classes/Command";
import Salty from "../../classes/Salty";

Command.register({
    name: "delay",
    aliases: ["sleep", "timeout"],
    category: "text",
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "*delay* ***anything***",
            effect: "I'll tell what you want after a provided delay",
        },
    ],

    async action({ args, msg }) {
        if (!args.length) {
            return Salty.warn(
                msg,
                "You must tell me what to say after the delay."
            );
        }
        const delay =
            args[1] && !isNaN(Number(args[0]))
                ? parseInt(args.shift()!) * 1000
                : 5000;

        msg.delete().catch();
        setTimeout(() => {
            Salty.message(msg, args.join(" "));
        }, delay);
    },
});
