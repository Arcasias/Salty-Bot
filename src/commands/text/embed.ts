import { MessageEmbed } from "discord.js";
import Command from "../../classes/Command";
import salty from "../../salty";

Command.register({
    name: "embed",
    aliases: ["json", "parse"],
    category: "text",
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***JSON data***",
            effect: "Parses the provided JSON as a Discord embed",
        },
    ],

    async action({ args, msg }) {
        let parsed;
        try {
            parsed = JSON.parse(args.join(" "));
        } catch (error) {
            return salty.warn(
                msg,
                "Given data must be formatted as a JSON string."
            );
        }
        if (!Object.keys(parsed).length) {
            return salty.warn(msg, "You must give me some data to parse.");
        }
        await salty.message(msg, null, { embed: new MessageEmbed(parsed) });
    },
});
