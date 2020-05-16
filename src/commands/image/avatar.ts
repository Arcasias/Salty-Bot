import fs from "fs";
import path from "path";
import Command, { CommandParams } from "../../classes/Command";
import Salty, { EmbedOptions } from "../../classes/Salty";
import { choice, possessive } from "../../utils";
import { owner } from "../../config";

const SALTY_IMAGES_PATH = "assets/img/salty";

class AvatarCommand extends Command {
    public name = "avatar";
    public keys = ["pic", "picture", "pp"];
    public help = [
        {
            argument: null,
            effect: "Shows a bigger version of your profile picture",
        },
        {
            argument: "***mention***",
            effect: "Shows a bigger version of ***mention***'s profile picture",
        },
    ];

    async action({ msg, target }: CommandParams) {
        const options: EmbedOptions = {
            title: `this is ${possessive(
                target.name
            )} profile pic`,
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
            } else if (target.user.id === owner.id) {
                options.description = "He's the coolest guy i know ^-^"; // owner
            } else if (msg.guild && Salty.isAdmin(target.user, msg.guild)) {
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
    }
}

export default AvatarCommand;
