import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";

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
    async action(msg) {
        const { name, anime, image } = choice(Salty.getList("waifus"));
        await Salty.embed(msg, {
            title: name,
            description: `anime: ${anime}`,
            image: choice(image),
        });
    },
});
