import fs from "fs";
import path from "path";
import Command from "../../classes/Command";
import Salty, { EmbedOptions } from "../../classes/Salty";
import { choice, possessive } from "../../utils";
import { owner } from "../../config";

export default new Command({
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
    visibility: "public",
    async action({ msg, target }) {
        const options: EmbedOptions = {
            title: `this is ${possessive(
                target.member.displayName
            )} profile pic`,
            color: target.member.displayColor,
        };
        if (target.user.id === Salty.bot.user.id) {
            // if Salty
            const files = fs.readdirSync("assets/img/salty");
            const pics = files.filter((f) => f.split(".").pop() === "png");
            options.title = `how cute, you asked for my profile pic ^-^`;
            options.files = [path.join("assets/img/salty/", choice(pics))];
        } else {
            if (target.user.bot) {
                options.description = "That's just a crappy bot"; // bot
            } else if (target.user.id === owner.id) {
                options.description = "He's the coolest guy i know ^-^"; // owner
            } else if (Salty.isAdmin(target.user, msg.guild)) {
                options.description = "It's a cute piece of shit"; // admin
            } else {
                options.description = "This is a huge piece of shit"; // else
            }
            options.image = { url: target.user.avatarURL({ size: 1024 }) };
        }
        await Salty.embed(msg, options);
    },
});
