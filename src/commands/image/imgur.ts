import imgur from "imgur";
import Command from "../../classes/Command";
import { MissingArg, SaltyException } from "../../classes/Exception";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";

imgur.setClientId();
imgur.setAPIUrl("https://api.imgur.com/3/");

export default new Command({
    name: "imgur",
    keys: ["img", "imgur"],
    help: [
        {
            argument: null,
            effect: "Work in progress",
        },
    ],
    visibility: "public",
    async action(msg, args) {
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
    },
});
