import Command from "../../classes/Command";
import Salty, { EmbedOptions } from "../../classes/Salty";

export default new Command({
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
    visibility: "public",
    async action({ msg, target }) {
        const options: EmbedOptions = {
            title: "this is a nice coffee",
            description: "specially made for you ;)",
            image: {
                url:
                    "https://cdn.cnn.com/cnnnext/dam/assets/150929101049-black-coffee-stock-super-tease.jpg",
            },
            color: 0x523415,
        };
        if (target.isMention) {
            if (target.user.id === Salty.bot.user.id) {
                options.description = "how cute, you gave me a coffee ^-^";
            } else {
                options.description = `Made with ♥ by **${msg.member.displayName}** for **${target.member.displayName}**`;
            }
        }
        await Salty.embed(msg, options);
    },
});
