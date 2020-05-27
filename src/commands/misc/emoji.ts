import { readdir } from "fs";
import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";

const emojiPath = "./assets/img/saltmoji";

Command.register({
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

    async action({ args, msg }) {
        const files: string[] = await new Promise((res, rej) => {
            readdir(emojiPath, (err, files) => {
                if (err) {
                    rej(err);
                }
                res(files);
            });
        });
        const pngs = files.filter((file) => file.split(".").pop() === "png");
        const emojiNames = pngs.map((name) => name.split(".").shift()!);

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
