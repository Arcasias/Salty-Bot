import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { SaltyEmbedOptions } from "../../types";

Command.register({
    name: "coffee",
    keys: ["cof", "covfefe"],
    help: [
        {
            argument: null,
            effect: "Gets you a nice hot coffee",
        },
        {
            argument: "***mention***",
            effect: "Gets the ***mention*** a nice hot coffee",
        },
    ],
    channel: "guild",

    async action({ msg, target }) {
        const options: SaltyEmbedOptions = {
            title: "this is a nice coffee",
            description: "specially made for you ;)",
            image: {
                url:
                    "https://cdn.cnn.com/cnnnext/dam/assets/150929101049-black-coffee-stock-super-tease.jpg",
            },
            color: 0x523415,
        };
        if (target.isMention) {
            if (target.user.id === Salty.bot.user!.id) {
                options.description = "how cute, you gave me a coffee ^-^";
            } else {
                options.description = `Made with ♥ by **${
                    msg.member!.displayName
                }** for **${target.name}**`;
            }
        }
        await Salty.embed(msg, options);
    },
});
