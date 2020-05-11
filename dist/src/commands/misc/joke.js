import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";
export default new Command({
    name: "joke",
    keys: ["fun", "haha", "jest", "joker", "jokes"],
    help: [
        {
            argument: null,
            effect: "Tells some spicy jokes !",
        },
    ],
    visibility: "public",
    async action(msg) {
        await Salty.message(msg, choice(Salty.getList("jokes")));
    },
});
