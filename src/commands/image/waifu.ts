import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { waifus } from "../../terms";
import { choice } from "../../utils";

Command.register({
    name: "waifu",
    aliases: ["waifus"],
    category: "image",
    help: [
        {
            argument: null,
            effect: "Gets you a proper waifu. It's about time",
        },
    ],

    async action({ msg }) {
        const { name, anime, image } = choice(waifus);
        await Salty.embed(msg, {
            title: name,
            description: `anime: ${anime}`,
            image: { url: choice(image) },
        });
    },
});
