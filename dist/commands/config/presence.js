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
        this.visibility = "dev";
    }
    async action({ args, msg }) {
        if (args[0] && terms_1.remove.includes(args[0])) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlc2VuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbWFuZHMvY29uZmlnL3ByZXNlbmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBRytCO0FBQy9CLGdFQUF3QztBQUN4Qyx1Q0FBcUM7QUFVckMsTUFBTSxVQUFVLEdBQWdCO0lBQzVCLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO0lBQ2pELElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtJQUN4QyxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7SUFDM0MsU0FBUyxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtDQUNwQyxDQUFDO0FBRUYsTUFBTSxlQUFnQixTQUFRLGlCQUFPO0lBQXJDOztRQUNXLFNBQUksR0FBRyxVQUFVLENBQUM7UUFDbEIsU0FBSSxHQUFHLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzlCLGVBQVUsR0FBcUIsS0FBSyxDQUFDO0lBNkJoRCxDQUFDO0lBM0JHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFpQjtRQUNyQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxjQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3JDLE1BQU0sZUFBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFDckQsZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztTQUNsRDthQUFNLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFJLE1BQU0sSUFBSSxVQUFVLEVBQUU7Z0JBRXRCLE1BQU0sZUFBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFxQixNQUFNLENBQUMsQ0FBQztnQkFDM0QsZUFBSyxDQUFDLE9BQU8sQ0FDVCxHQUFHLEVBQ0gsMEJBQTBCLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLElBQUksRUFDdEQsRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUN0QyxDQUFDO2FBQ0w7aUJBQU07Z0JBRUgsTUFBTSxlQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7b0JBQzdCLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7aUJBQzdCLENBQUMsQ0FBQztnQkFDSCxlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSw0QkFBNEIsTUFBTSxJQUFJLENBQUMsQ0FBQzthQUM5RDtTQUNKO2FBQU07WUFDSCxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLFVBQVUsQ0FBQyxlQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEUsTUFBTSxXQUFXLEdBQUcsZUFBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUNuRCxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztTQUNuRDtJQUNMLENBQUM7Q0FDSjtBQUVELGtCQUFlLGVBQWUsQ0FBQyJ9