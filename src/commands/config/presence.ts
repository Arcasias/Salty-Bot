import Command from "../../classes/Command";
import Salty from "../../classes/Salty";

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
        if (args[0] && Salty.getList("delete").includes(args[0])) {
            await Salty.bot.user.setPresence({
                game: null,
                status: Salty.bot.user.presence.status,
            });
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
                    game: { name: status },
                    status: Salty.bot.user.presence.status,
                });
                Salty.success(msg, `changed my presence to **${status}**`);
            }
        } else {
            const { color, title } = STATUSINFO[Salty.bot.user.presence.status];
            const description =
                Salty.bot.user.presence.game &&
                Salty.bot.user.presence.game.name;
            Salty.embed(msg, { color, title, description });
        }
    },
});
