import Command, { CommandParams } from "../../classes/Command";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";
import { waifus } from "../../terms";

class WaifuCommand extends Command {
    public name = "waifu";
    public keys = ["waifus"];
    public help = [
        {
            argument: null,
            effect: "Gets you a proper waifu. It's about time",
        },
    ];

    async action({ msg }: CommandParams) {
        const { name, anime, image } = choice(waifus);
        await Salty.embed(msg, {
            title: name,
            description: `anime: ${anime}`,
            image: { url: choice(image) },
        });
    }
}

export default WaifuCommand;
