import fs from "fs";
import path from "path";
import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { SaltyEmbedOptions } from "../../types";
import { choice, isAdmin, isOwner, possessive } from "../../utils";

const SALTY_IMAGES_PATH = "assets/img/salty";

Command.register({
    name: "avatar",
    keys: ["pic", "picture", "pp"],
    help: [
        {
            argument: null,
            effect: "Shows a bigger version of your profile picture",
        },
        {
            argument: "***mention***",
            effect: "Shows a bigger version of ***mention***'s profile picture",
        },
    ],

    async action({ msg, target }) {
        const options: SaltyEmbedOptions = {
            title: `this is ${possessive(target.name)} profile pic`,
            color: target.member?.displayColor,
        };
        if (target.user.id === Salty.bot.user!.id) {
            // if Salty
            const files = fs.readdirSync(SALTY_IMAGES_PATH);
            const pics = files.filter((f) => f.split(".").pop() === "png");
            options.title = `This is a picture of me. `;
            options.files = [path.join(SALTY_IMAGES_PATH, choice(pics))];
        } else {
            if (target.user.bot) {
                options.description = "That's just a crappy bot"; // bot
            } else if (isOwner(target.user)) {
                options.description = "He's the coolest guy i know ^-^"; // owner
            } else if (msg.guild && isAdmin(target.user, msg.guild)) {
                options.description = "It's a cute piece of shit"; // admin
            } else {
                options.description = "This is a huge piece of shit"; // else
            }
            const url = target.user.avatarURL({ size: 1024 });
            if (url) {
                options.image = { url };
            }
        }
        await Salty.embed(msg, options);
    },
});
