"use strict";

const Command = require("../../classes/Command.js");
const Salty = require("../../classes/Salty.js");

const STATUSINFO = {
    dnd: { title: "do not disturb", color: 15746887 },
    idle: { title: "idle", color: 16426522 },
    online: { title: "online", color: 4437378 },
};

module.exports = new Command({
    name: "presence",
    keys: ["game", "status"],
    visibility: "dev",
    async action(msg, args) {
        if (args[0] && Salty.getList("delete").includes(args[0])) {
            await Salty.bot.user.setPresence({
                game: null,
                status: Salty.bot.user.presence.status,
            });
            Salty.embed(msg, {
                title: "current presence removed",
                type: "success",
            });
        } else if (args[0]) {
            const status = args[0];
            if (status in STATUSINFO) {
                // status
                await Salty.bot.user.setStatus(status);
                Salty.embed(msg, {
                    color: STATUSINFO[status].color,
                    title: `changed my status to **${STATUSINFO[status].title}**`,
                    type: "success",
                });
            } else {
                // game
                await Salty.bot.user.setPresence({
                    game: { name: status },
                    status: Salty.bot.user.presence.status,
                });
                Salty.embed(msg, {
                    title: `changed my presence to **${status}**`,
                    type: "success",
                });
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
