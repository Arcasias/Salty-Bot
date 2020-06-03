import { PresenceStatusData } from "discord.js";
import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { remove } from "../../terms";
import { StatusInfos } from "../../types";

const STATUSINFO: StatusInfos = {
    dnd: { title: "do not disturb", color: 15746887 },
    idle: { title: "idle", color: 16426522 },
    online: { title: "online", color: 4437378 },
    invisible: { title: "invisible" },
};

Command.register({
    name: "presence",
    aliases: ["activity", "status"],
    category: "config",
    access: "dev",

    async action({ args, msg }) {
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
    },
});
