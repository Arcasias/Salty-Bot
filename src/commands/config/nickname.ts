import { GuildMember, Message } from "discord.js";
import Command from "../../classes/Command";
import { MissingArg } from "../../classes/Exception";
import PromiseManager from "../../classes/PromiseManager";
import Salty from "../../classes/Salty";
import { add as addList, remove as removeList } from "../../data/list";

async function changeNames(msg, transformation) {
    const members: GuildMember[] = msg.guild.members.array();
    const progressMsg: Message = await Salty.message(
        msg,
        `changing nicknames: 0/${members.length}`
    );
    const pm: PromiseManager = new PromiseManager();
    for (let i = 0; i < members.length; i++) {
        const newNick = transformation(
            members[i].nickname ? members[i].nickname : members[i].user.username
        );
        if (newNick !== members[i].nickname) {
            try {
                await members[i].setNickname(newNick);
                pm.add(
                    progressMsg.edit.bind(
                        progressMsg,
                        `changing nicknames: ${i++}/${members.length}`
                    )
                );
            } catch (err) {
                if (
                    err.name !== "DiscordAPIError" ||
                    err.message !== "Missing Permissions"
                ) {
                    throw err;
                }
            }
        } else {
            pm.add(
                progressMsg.edit.bind(
                    progressMsg,
                    `changing nicknames: ${i++}/${members.length}`
                )
            );
        }
    }
    pm.add(progressMsg.delete.bind(progressMsg));
    Salty.success(msg, "nicknames successfully changed");
}

export default new Command({
    name: "nickname",
    keys: ["name", "nick", "pseudo"],
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "add ***particle***",
            effect:
                "Appends the ***particle*** to every possible nickname in the server. Careful to not exceed 32 characters !",
        },
        {
            argument: "remove ***particle***",
            effect: "Removes the ***particle*** from each matching nickname",
        },
    ],
    visibility: "admin",
    async action(msg, args) {
        const particle: string = args.slice(1).join(" ");
        const particleRegex: RegExp = new RegExp(particle, "g");

        if (!args[0]) {
            throw new MissingArg("add or delete + particle");
        } else {
            if (!particle) {
                throw new MissingArg("nickname particle");
            }
            if (addList.includes(args[0])) {
                await changeNames.call(this, msg, (nickname) =>
                    nickname.match(particleRegex)
                        ? nickname
                        : `${nickname.trim()} ${particle}`
                );
            } else if (removeList.includes(args[0])) {
                await changeNames.call(this, msg, (nickname) =>
                    nickname.replace(particleRegex, "").trim()
                );
            } else {
                throw new MissingArg("add or delete + particle");
            }
        }
    },
});
