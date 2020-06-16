import Command from "../../classes/Command";
import salty from "../../salty";
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
        await salty.embed(msg, {
            title: name,
            description: `anime: ${anime}`,
            image: { url: choice(image) },
        });
    },
});
