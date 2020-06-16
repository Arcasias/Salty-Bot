import { PresenceStatusData } from "discord.js";
import Command from "../../classes/Command";
import salty from "../../salty";
import { StatusInfos } from "../../types";
import { meaning } from "../../utils";

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
        switch (meaning(args[0])) {
            case "remove":
            case "clear": {
                await salty.bot.user!.setPresence({ activity: undefined });
                return salty.success(msg, "current status removed");
            }
            case "add":
            case "set": {
                args.shift();
            }
            case "string": {
                const status = args[0];
                if (status in STATUSINFO) {
                    // status
                    await salty.bot.user!.setStatus(<PresenceStatusData>status);
                    return salty.success(
                        msg,
                        `changed my status to **${
                            STATUSINFO[<keyof StatusInfos>status].title
                        }**`,
                        { color: STATUSINFO[<keyof StatusInfos>status].color }
                    );
                } else {
                    // game
                    await salty.bot.user!.setPresence({
                        activity: { name: status },
                    });
                    return salty.success(
                        msg,
                        `changed my status to **${status}**`
                    );
                }
            }
            default: {
                const { color, title } = STATUSINFO[
                    <keyof StatusInfos>salty.bot.user!.presence.status
                ];
                const description = salty.bot.user!.presence.status;
                salty.embed(msg, { color, title, description });
            }
        }
    },
});
