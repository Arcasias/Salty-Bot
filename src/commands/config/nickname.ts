import { GuildMember, Message } from "discord.js";
import Command from "../../classes/Command";
import PromiseManager from "../../classes/PromiseManager";
import Salty from "../../classes/Salty";
import { add as addList, remove as removeList } from "../../terms";

async function changeNames(
    msg: Message,
    transformation: (nickname: string) => string
) {
    const members: GuildMember[] = msg.guild!.members.cache.array();
    const progressMsg: Message = await Salty.message(
        msg,
        `changing nicknames: 0/${members.length}`
    );
    const pm: PromiseManager = new PromiseManager();
    for (let i = 0; i < members.length; i++) {
        const newNick = transformation(members[i].displayName);
        if (newNick !== members[i].nickname) {
            try {
                await members[i].setNickname(newNick);
                pm.add(
                    progressMsg.edit.bind(progressMsg, {
                        content: `changing nicknames: ${i++}/${members.length}`,
                    })
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
                progressMsg.edit.bind(progressMsg, {
                    content: `changing nicknames: ${i++}/${members.length}`,
                })
            );
        }
    }
    pm.add(progressMsg.delete.bind(progressMsg));
    Salty.success(msg, "nicknames successfully changed");
}

Command.register({
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
                "Appends the ***particle*** to every possible nickname in the server. Careful to not exceed 32 characters!",
        },
        {
            argument: "remove ***particle***",
            effect: "Removes the ***particle*** from each matching nickname",
        },
    ],
    access: "admin",
    channel: "guild",

    async action({ args, msg }) {
        const particle = args.slice(1).join(" ");
        const particleRegex = new RegExp(particle, "g");
        if (addList.includes(args[0])) {
            await changeNames.call(this, msg, (nickname: string) =>
                nickname.match(particleRegex)
                    ? nickname
                    : `${nickname.trim()} ${particle}`
            );
        } else if (removeList.includes(args[0])) {
            await changeNames.call(this, msg, (nickname: string) =>
                nickname.replace(particleRegex, "").trim()
            );
        } else if (args.length) {
            return Salty.warn(
                msg,
                "You need to specify what nickname particle will be targeted."
            );
        } else {
            return Salty.warn(
                msg,
                "You need to tell whether to add or delete a global nickname particle."
            );
        }
    },
});
