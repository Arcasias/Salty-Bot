import fs from "fs";
import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { choice } from "../../utils";
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
    async action(msg, args) {
        fs.readdir(emojiPath, (error, files) => {
            if (error) {
                return error(error);
            }
            let pngs = files.filter((file) => file.split(".").pop() === "png");
            let emojiNames = pngs.map((name) => name.split(".").shift());
            if (args[0]) {
                let arg = args[0].toLowerCase();
                let emoji = false;
                if ("rand" === arg || "random" === arg) {
                    emoji = choice(emojiNames);
                }
                else if (emojiNames.includes(arg)) {
                    emoji = arg;
                }
                if (emoji) {
                    msg.delete();
                    return msg.channel.send({
                        files: [`${emojiPath}/${emoji}.png`],
                    });
                }
            }
            Salty.embed(msg, {
                title: "list of saltmojis",
                description: emojiNames.join("\n"),
            });
        });
    },
});
