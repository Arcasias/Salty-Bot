import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { remove } from "../../data/list";

interface StatusInfo {
    title: string;
    color: number;
}

type StatusInfos = { [status: string]: StatusInfo };

const STATUSINFO: StatusInfos = {
    dnd: { title: "do not disturb", color: 15746887 },
    idle: { title: "idle", color: 16426522 },
    online: { title: "online", color: 4437378 },
};

export default new Command({
    name: "presence",
    keys: ["game", "status"],
    visibility: "dev",
    async action(msg, args) {
        if (args[0] && remove.includes(args[0])) {
            await Salty.bot.user.setPresence({ activity: null });
            Salty.success(msg, "current presence removed");
        } else if (args[0]) {
            const status = args[0];
            if (status in STATUSINFO) {
                // status
                await Salty.bot.user.setStatus(status);
                Salty.success(
                    msg,
                    `changed my status to **${STATUSINFO[status].title}**`,
                    { color: STATUSINFO[status].color }
                );
            } else {
                // game
                await Salty.bot.user.setPresence({
                    activity: { name: status },
                });
                Salty.success(msg, `changed my presence to **${status}**`);
            }
        } else {
            const { color, title } = STATUSINFO[Salty.bot.user.presence.status];
            const description = Salty.bot.user.presence.status;
            Salty.embed(msg, { color, title, description });
        }
    },
});