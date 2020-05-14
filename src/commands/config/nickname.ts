import { GuildMember, Message } from "discord.js";
import Command, {
    CommandParams,
    CommandAccess,
    CommandChannel,
} from "../../classes/Command";
import { MissingArg } from "../../classes/Exception";
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

class NickNameCommand extends Command {
    public name = "nickname";
    public keys = ["name", "nick", "pseudo"];
    public help = [
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
    ];
    public access: CommandAccess = "admin";
    public channel: CommandChannel = "guild";

    async action({ args, msg }: CommandParams) {
        const particle = args.slice(1).join(" ");
        const particleRegex = new RegExp(particle, "g");
        if (!args.length) {
            throw new MissingArg("add or delete + particle");
        } else {
            if (!particle) {
                throw new MissingArg("nickname particle");
            }
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
            } else {
                throw new MissingArg("add or delete + particle");
            }
        }
    }
}

export default NickNameCommand;
