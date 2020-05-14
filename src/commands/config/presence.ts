import Command, { CommandAccess, CommandParams } from "../../classes/Command";
import Salty from "../../classes/Salty";
import { remove } from "../../terms";
import { PresenceStatusData } from "discord.js";

interface StatusInfo {
    title: string;
    color?: number;
}

type StatusInfos = { [status in PresenceStatusData]: StatusInfo };

const STATUSINFO: StatusInfos = {
    dnd: { title: "do not disturb", color: 15746887 },
    idle: { title: "idle", color: 16426522 },
    online: { title: "online", color: 4437378 },
    invisible: { title: "invisible" },
};

class PresenceCommand extends Command {
    public name = "presence";
    public keys = ["activity", "status"];
    public access: CommandAccess = "dev";

    async action({ args, msg }: CommandParams) {
        if (args[0] && remove.includes(args[0])) {
            await Salty.bot.user!.setPresence({ activity: undefined });
            Salty.success(msg, "current presence removed");
        } else if (args[0]) {
            const status = args[0];
            if (status in STATUSINFO) {
                // status
                await Salty.bot.user!.setStatus(<PresenceStatusData>status);
                Salty.success(
                    msg,
                    `changed my status to **${
                        STATUSINFO[<keyof StatusInfos>status].title
                    }**`,
                    { color: STATUSINFO[<keyof StatusInfos>status].color }
                );
            } else {
                // game
                await Salty.bot.user!.setPresence({
                    activity: { name: status },
                });
                Salty.success(msg, `changed my presence to **${status}**`);
            }
        } else {
            const { color, title } = STATUSINFO[
                <keyof StatusInfos>Salty.bot.user!.presence.status
            ];
            const description = Salty.bot.user!.presence.status;
            Salty.embed(msg, { color, title, description });
        }
    }
}

export default PresenceCommand;
