import imgur from "imgur";
import Command, { CommandParams } from "../../classes/Command";
import { MissingArg, SaltyException } from "../../classes/Exception";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";

imgur.setClientId();
imgur.setAPIUrl("https://api.imgur.com/3/");

class ImgurCommand extends Command {
    public name = "imgur";
    public keys = ["img", "imgur"];
    public help = [
        {
            argument: null,
            effect: "Work in progress",
        },
    ];

    async action({ args, msg }: CommandParams) {
        if (!args[0]) {
            throw new MissingArg("image name");
        }

        try {
            const json = await imgur.search(args.join("AND"), {
                sort: "top",
                dateRange: "all",
                page: 1,
            });
            if (json.data.length < 1) {
                throw new SaltyException("no result");
            }
            const { title, link, images } = choice(json.data);
            const image = images ? images[0].link : link;
            Salty.embed(msg, { title, url: link, image });
        } catch (err) {
            Salty.error(msg, "no result");
        }
    }
}

export default ImgurCommand;
