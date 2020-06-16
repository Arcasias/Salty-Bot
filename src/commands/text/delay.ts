import Command from "../../classes/Command";
import salty from "../../salty";

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
            return salty.warn(
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
            salty.message(msg, args.join(" "));
        }, delay);
    },
});
