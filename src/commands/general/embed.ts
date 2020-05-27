import { MessageEmbed } from "discord.js";
import Command from "../../classes/Command";
import Salty from "../../classes/Salty";

Command.register({
    name: "embed",
    keys: ["json", "parse"],
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
            return Salty.warn(
                msg,
                "Given data must be formatted as a JSON string."
            );
        }
        if (!Object.keys(parsed).length) {
            return Salty.warn(msg, "You must give me some data to parse.");
        }
        await Salty.message(msg, null, { embed: new MessageEmbed(parsed) });
    },
});
