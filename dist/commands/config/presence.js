"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const terms_1 = require("../../terms");
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
        if (args[0] && terms_1.remove.includes(args[0])) {
            await Salty_1.default.bot.user.setPresence({ activity: undefined });
            Salty_1.default.success(msg, "current presence removed");
        }
        else if (args[0]) {
            const status = args[0];
            if (status in STATUSINFO) {
                await Salty_1.default.bot.user.setStatus(status);
                Salty_1.default.success(msg, `changed my status to **${STATUSINFO[status].title}**`, { color: STATUSINFO[status].color });
            }
            else {
                await Salty_1.default.bot.user.setPresence({
                    activity: { name: status },
                });
                Salty_1.default.success(msg, `changed my presence to **${status}**`);
            }
        }
        else {
            const { color, title } = STATUSINFO[Salty_1.default.bot.user.presence.status];
            const description = Salty_1.default.bot.user.presence.status;
            Salty_1.default.embed(msg, { color, title, description });
        }
    },
});
