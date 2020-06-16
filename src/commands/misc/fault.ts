import Command from "../../classes/Command";
import salty from "../../salty";
import { fault } from "../../terms";
import { choice } from "../../utils";

Command.register({
    name: "fault",
    aliases: ["overwatch", "reason"],
    category: "misc",
    help: [
        {
            argument: null,
            effect: "Check whose fault it is",
        },
    ],

    async action({ msg }) {
        const text = (choice(fault.start) + choice(fault.sentence))
            .replace(/<subject>/g, choice(fault.subject))
            .replace(/<reason>/g, choice(fault.reason))
            .replace(/<punishment>/g, choice(fault.punishment));

        await salty.message(msg, text);
    },
});
