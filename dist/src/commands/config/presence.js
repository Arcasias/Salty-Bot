"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const list_1 = require("../../list");
const STATUSINFO = {
    dnd: { title: "do not disturb", color: 15746887 },
    idle: { title: "idle", color: 16426522 },
    online: { title: "online", color: 4437378 },
    invisible: { title: "invisible" },
};
class PresenceCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "presence";
        this.keys = ["game", "status"];
        this.visibility = "dev";
    }
    async action({ msg, args }) {
        if (args[0] && list_1.remove.includes(args[0])) {
            await Salty_1.default.bot.user.setPresence({ activity: null });
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
    }
}
exports.default = PresenceCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlc2VuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tbWFuZHMvY29uZmlnL3ByZXNlbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQWtFO0FBQ2xFLGdFQUF3QztBQUN4QyxxQ0FBb0M7QUFVcEMsTUFBTSxVQUFVLEdBQWdCO0lBQzVCLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0lBQ2pELElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtJQUN4QyxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7SUFDM0MsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtDQUNwQyxDQUFDO0FBRUYsTUFBTSxlQUFnQixTQUFRLGlCQUFPO0lBQXJDOztRQUNXLFNBQUksR0FBRyxVQUFVLENBQUM7UUFDbEIsU0FBSSxHQUFHLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzFCLGVBQVUsR0FBcUIsS0FBSyxDQUFDO0lBNkJoRCxDQUFDO0lBM0JHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO1FBQ3RCLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLGFBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDckMsTUFBTSxlQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNyRCxlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO1NBQ2xEO2FBQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDaEIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksTUFBTSxJQUFJLFVBQVUsRUFBRTtnQkFFdEIsTUFBTSxlQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQXFCLE1BQU0sQ0FBQyxDQUFDO2dCQUMzRCxlQUFLLENBQUMsT0FBTyxDQUNULEdBQUcsRUFDSCwwQkFBMEIsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUN0RCxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQ3RDLENBQUM7YUFDTDtpQkFBTTtnQkFFSCxNQUFNLGVBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztvQkFDN0IsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtpQkFDN0IsQ0FBQyxDQUFDO2dCQUNILGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLDRCQUE0QixNQUFNLElBQUksQ0FBQyxDQUFDO2FBQzlEO1NBQ0o7YUFBTTtZQUNILE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsVUFBVSxDQUFDLGVBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNwRSxNQUFNLFdBQVcsR0FBRyxlQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQ25ELGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFDO1NBQ25EO0lBQ0wsQ0FBQztDQUNKO0FBRUQsa0JBQWUsZUFBZSxDQUFDIn0=