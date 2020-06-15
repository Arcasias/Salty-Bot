"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const utils_1 = require("../../utils");
const STATUSINFO = {
    dnd: { title: "do not disturb", color: 15746887 },
    idle: { title: "idle", color: 16426522 },
    online: { title: "online", color: 4437378 },
    invisible: { title: "invisible" },
};
Command_1.default.register({
    name: "presence",
    aliases: ["activity", "status"],
    category: "config",
    access: "dev",
    async action({ args, msg }) {
        switch (utils_1.meaning(args[0])) {
            case "add":
            case "set": {
                await Salty_1.default.bot.user.setPresence({ activity: undefined });
                return Salty_1.default.success(msg, "current presence removed");
            }
            case "string": {
                const status = args[0];
                if (status in STATUSINFO) {
                    await Salty_1.default.bot.user.setStatus(status);
                    return Salty_1.default.success(msg, `changed my status to **${STATUSINFO[status].title}**`, { color: STATUSINFO[status].color });
                }
                else {
                    await Salty_1.default.bot.user.setPresence({
                        activity: { name: status },
                    });
                    return Salty_1.default.success(msg, `changed my presence to **${status}**`);
                }
            }
            default: {
                const { color, title } = STATUSINFO[Salty_1.default.bot.user.presence.status];
                const description = Salty_1.default.bot.user.presence.status;
                Salty_1.default.embed(msg, { color, title, description });
            }
        }
    },
});
