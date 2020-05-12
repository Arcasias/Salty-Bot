import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";
import { waifus } from "../../list";

export default new Command({
    name: "waifu",
    keys: ["waifus"],
    help: [
        {
            argument: null,
            effect: "Gets you a proper waifu. It's about time",
        },
    ],
    visibility: "public",
    async action({ msg }) {
        const { name, anime, image } = choice(waifus);
        await Salty.embed(msg, {
            title: name,
            description: `anime: ${anime}`,
            image: { url: choice(image) },
        });
    },
});
