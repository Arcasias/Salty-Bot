import fs from "fs";
import path from "path";
import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { choice, possessive } from "../../utils";

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
    async action(msg) {
        // Sets author as default user and adapt color to his/her role
        const mention = msg.mentions.users.first();
        const targetUser = mention ? mention : msg.author;

        const name = mention ? mention.displayName : msg.member.displayName;
        const color = mention
            ? mention.highestRole.color
            : msg.member.highestRole.color;
        let desc = "This is a huge piece of shit";

        // If there is someone in the mention list, sets that user as new default then generates random color for the swag
        if (targetUser.bot) {
            desc = "That's just a crappy bot"; // bot
        } else if (targetUser.id === Salty.config.owner.id) {
            desc = "He's the coolest guy i know ^-^"; // owner
        } else if (Salty.isAdmin(targetUser, msg.guild)) {
            desc = "It's a cute piece of shit"; // admin
        }

        // Creates embed message
        const options: any = {
            title: `this is ${possessive(name)} profile pic`,
        };

        if (targetUser.id === Salty.bot.user.id) {
            // if Salty
            const files = fs.readdirSync("assets/img/salty");
            const pics = files.filter((f) => f.split(".").pop() === "png");
            options.title = `how cute, you asked for my profile pic ^-^`;
            options.file = path.join("assets/img/salty/", choice(pics));
        } else {
            options.image = targetUser.avatarURL;
            options.color = parseInt(color);
            options.description = desc;
        }
        await Salty.embed(msg, options);
    },
});
