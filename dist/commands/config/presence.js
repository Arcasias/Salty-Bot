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
    keys: ["activity", "status"],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlc2VuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvY29uZmlnL3ByZXNlbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esb0VBQTRDO0FBQzVDLGdFQUF3QztBQUN4Qyx1Q0FBcUM7QUFHckMsTUFBTSxVQUFVLEdBQWdCO0lBQzVCLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0lBQ2pELElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtJQUN4QyxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7SUFDM0MsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtDQUNwQyxDQUFDO0FBRUYsaUJBQU8sQ0FBQyxRQUFRLENBQUM7SUFDYixJQUFJLEVBQUUsVUFBVTtJQUNoQixJQUFJLEVBQUUsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDO0lBQzVCLE1BQU0sRUFBRSxLQUFLO0lBRWIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUU7UUFDdEIsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksY0FBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNyQyxNQUFNLGVBQUssQ0FBQyxHQUFHLENBQUMsSUFBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBQzNELGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLDBCQUEwQixDQUFDLENBQUM7U0FDbEQ7YUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsSUFBSSxNQUFNLElBQUksVUFBVSxFQUFFO2dCQUV0QixNQUFNLGVBQUssQ0FBQyxHQUFHLENBQUMsSUFBSyxDQUFDLFNBQVMsQ0FBcUIsTUFBTSxDQUFDLENBQUM7Z0JBQzVELGVBQUssQ0FBQyxPQUFPLENBQ1QsR0FBRyxFQUNILDBCQUNJLFVBQVUsQ0FBb0IsTUFBTSxDQUFDLENBQUMsS0FDMUMsSUFBSSxFQUNKLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBb0IsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQ3pELENBQUM7YUFDTDtpQkFBTTtnQkFFSCxNQUFNLGVBQUssQ0FBQyxHQUFHLENBQUMsSUFBSyxDQUFDLFdBQVcsQ0FBQztvQkFDOUIsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtpQkFDN0IsQ0FBQyxDQUFDO2dCQUNILGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLDRCQUE0QixNQUFNLElBQUksQ0FBQyxDQUFDO2FBQzlEO1NBQ0o7YUFBTTtZQUNILE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsVUFBVSxDQUNaLGVBQUssQ0FBQyxHQUFHLENBQUMsSUFBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQ3JELENBQUM7WUFDRixNQUFNLFdBQVcsR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDLElBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQ3BELGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO1NBQ25EO0lBQ0wsQ0FBQztDQUNKLENBQUMsQ0FBQyJ9