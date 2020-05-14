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
class PresenceCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "presence";
        this.keys = ["activity", "status"];
        this.access = "dev";
    }
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
    }
}
exports.default = PresenceCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlc2VuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvY29uZmlnL3ByZXNlbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQThFO0FBQzlFLGdFQUF3QztBQUN4Qyx1Q0FBcUM7QUFVckMsTUFBTSxVQUFVLEdBQWdCO0lBQzVCLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0lBQ2pELElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtJQUN4QyxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7SUFDM0MsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtDQUNwQyxDQUFDO0FBRUYsTUFBTSxlQUFnQixTQUFRLGlCQUFPO0lBQXJDOztRQUNXLFNBQUksR0FBRyxVQUFVLENBQUM7UUFDbEIsU0FBSSxHQUFHLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzlCLFdBQU0sR0FBa0IsS0FBSyxDQUFDO0lBaUN6QyxDQUFDO0lBL0JHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFpQjtRQUNyQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxjQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3JDLE1BQU0sZUFBSyxDQUFDLEdBQUcsQ0FBQyxJQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUM7WUFDM0QsZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztTQUNsRDthQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFJLE1BQU0sSUFBSSxVQUFVLEVBQUU7Z0JBRXRCLE1BQU0sZUFBSyxDQUFDLEdBQUcsQ0FBQyxJQUFLLENBQUMsU0FBUyxDQUFxQixNQUFNLENBQUMsQ0FBQztnQkFDNUQsZUFBSyxDQUFDLE9BQU8sQ0FDVCxHQUFHLEVBQ0gsMEJBQ0ksVUFBVSxDQUFvQixNQUFNLENBQUMsQ0FBQyxLQUMxQyxJQUFJLEVBQ0osRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFvQixNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FDekQsQ0FBQzthQUNMO2lCQUFNO2dCQUVILE1BQU0sZUFBSyxDQUFDLEdBQUcsQ0FBQyxJQUFLLENBQUMsV0FBVyxDQUFDO29CQUM5QixRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO2lCQUM3QixDQUFDLENBQUM7Z0JBQ0gsZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsNEJBQTRCLE1BQU0sSUFBSSxDQUFDLENBQUM7YUFDOUQ7U0FDSjthQUFNO1lBQ0gsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxVQUFVLENBQ1osZUFBSyxDQUFDLEdBQUcsQ0FBQyxJQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FDckQsQ0FBQztZQUNGLE1BQU0sV0FBVyxHQUFHLGVBQUssQ0FBQyxHQUFHLENBQUMsSUFBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7WUFDcEQsZUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUM7U0FDbkQ7SUFDTCxDQUFDO0NBQ0o7QUFFRCxrQkFBZSxlQUFlLENBQUMifQ==