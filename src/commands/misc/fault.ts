import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";

export default new Command({
    name: "fault",
    keys: ["overwatch", "reason"],
    help: [
        {
            argument: null,
            effect: "Check whose fault it is",
        },
    ],
    visibility: "public",
    async action(msg) {
        const fault = Salty.getList("fault");
        const text = (choice(fault.start) + choice(fault.sentence))
            .replace(/<subject>/g, choice(fault.subject))
            .replace(/<reason>/g, choice(fault.reason))
            .replace(/<punishment>/g, choice(fault.punishment));

        await Salty.message(msg, text);
    },
});
