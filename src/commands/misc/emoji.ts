import { readdir } from "fs";
import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { choice, promisify } from "../../utils";

const emojiPath = "./assets/img/saltmoji";

export default new Command({
    name: "emoji",
    keys: ["emojis", "saltmoji", "saltmojis"],
    help: [
        {
            argument: null,
            effect: "Shows my emojis list",
        },
        {
            argument: "***emoji name***",
            effect: "Sends the indicated emoji",
        },
    ],
    visibility: "public",
    async action({ msg, args }) {
        const files: string[] = await promisify(readdir.bind(null, emojiPath));
        const pngs = files.filter((file) => file.split(".").pop() === "png");
        const emojiNames = pngs.map((name) => name.split(".").shift());

        if (args[0]) {
            const arg = args[0].toLowerCase();
            let emoji: string | null = null;

            if (["rand", "random"].includes(arg)) {
                emoji = choice(emojiNames);
            } else if (emojiNames.includes(arg)) {
                emoji = arg;
            }
            if (emoji) {
                msg.delete();
                return Salty.message(msg, "", {
                    files: [`${emojiPath}/${emoji}.png`],
                });
            }
        }
        Salty.embed(msg, {
            title: "list of saltmojis",
            description: emojiNames.join("\n"),
        });
    },
});
