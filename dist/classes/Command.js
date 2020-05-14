"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const Exception_1 = require("./Exception");
const Salty_1 = __importDefault(require("./Salty"));
const list = __importStar(require("../terms"));
const permissions = {
    admin: Salty_1.default.isAdmin,
    dev: Salty_1.default.isDev,
    owner: Salty_1.default.isOwner,
};
const MEANING_ACTIONS = [
    "add",
    "remove",
    "clear",
    "list",
    "bot",
    "buy",
    "sell",
];
class Command {
    constructor() {
        this.help = [];
        this.keys = [];
        this.name = "";
        this.access = "public";
        this.environment = "all";
        this.channel = "all";
    }
    async run(msg, args) {
        var _a;
        try {
            if (this.access !== "public" &&
                msg.guild &&
                !permissions[this.access].call(Salty_1.default, msg.author, msg.guild)) {
                throw new Exception_1.PermissionDenied(this.access);
            }
            if (this.environment !== "all" &&
                this.environment !== process.env.MODE) {
                throw new Exception_1.SaltyException("WrongEnvironment", "it looks like I'm not in the right environment to do that");
            }
            if (this.channel === "guild" && !msg.guild) {
                throw new Exception_1.SaltyException("WrongChannel", "this is a direct message channel retard");
            }
            const mentioned = Boolean(msg.mentions.users.size);
            const target = {
                user: mentioned ? msg.mentions.users.first() : msg.author,
                member: mentioned ? msg.mentions.members.first() : msg.member,
                isMention: mentioned,
                name: "",
            };
            target.name = ((_a = target.member) === null || _a === void 0 ? void 0 : _a.displayName) || target.user.username;
            const commandParams = { msg, args, target };
            await this.action(commandParams);
        }
        catch (err) {
            if (err instanceof Exception_1.SaltyException) {
                return Salty_1.default.error(msg, err.message);
            }
            else {
                utils_1.error(err.stack);
            }
        }
    }
    meaning(word) {
        if (word) {
            return (MEANING_ACTIONS.find((w) => { var _a; return (_a = list[w]) === null || _a === void 0 ? void 0 : _a.includes(word); }) || "string");
        }
        else {
            return "noarg";
        }
    }
}
exports.default = Command;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGFzc2VzL0NvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0Esb0NBQXdDO0FBQ3hDLDJDQUErRDtBQUMvRCxvREFBNEI7QUFDNUIsK0NBQWlDO0FBRWpDLE1BQU0sV0FBVyxHQUFHO0lBQ2hCLEtBQUssRUFBRSxlQUFLLENBQUMsT0FBTztJQUNwQixHQUFHLEVBQUUsZUFBSyxDQUFDLEtBQUs7SUFDaEIsS0FBSyxFQUFFLGVBQUssQ0FBQyxPQUFPO0NBQ3ZCLENBQUM7QUFDRixNQUFNLGVBQWUsR0FBRztJQUNwQixLQUFLO0lBQ0wsUUFBUTtJQUNSLE9BQU87SUFDUCxNQUFNO0lBQ04sS0FBSztJQUNMLEtBQUs7SUFDTCxNQUFNO0NBQ1QsQ0FBQztBQXdCRixNQUFlLE9BQU87SUFBdEI7UUFFb0IsU0FBSSxHQUFrQixFQUFFLENBQUM7UUFDekIsU0FBSSxHQUFhLEVBQUUsQ0FBQztRQUNwQixTQUFJLEdBQVcsRUFBRSxDQUFDO1FBRWxCLFdBQU0sR0FBa0IsUUFBUSxDQUFDO1FBQ2pDLGdCQUFXLEdBQXVCLEtBQUssQ0FBQztRQUN4QyxZQUFPLEdBQW1CLEtBQUssQ0FBQztJQTJEcEQsQ0FBQztJQXBEVSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQVksRUFBRSxJQUFjOztRQUN6QyxJQUFJO1lBQ0EsSUFDSSxJQUFJLENBQUMsTUFBTSxLQUFLLFFBQVE7Z0JBQ3hCLEdBQUcsQ0FBQyxLQUFLO2dCQUNULENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUM5RDtnQkFDRSxNQUFNLElBQUksNEJBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzNDO1lBQ0QsSUFDSSxJQUFJLENBQUMsV0FBVyxLQUFLLEtBQUs7Z0JBQzFCLElBQUksQ0FBQyxXQUFXLEtBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQ3ZDO2dCQUNFLE1BQU0sSUFBSSwwQkFBYyxDQUNwQixrQkFBa0IsRUFDbEIsMkRBQTJELENBQzlELENBQUM7YUFDTDtZQUNELElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFO2dCQUN4QyxNQUFNLElBQUksMEJBQWMsQ0FDcEIsY0FBYyxFQUNkLHlDQUF5QyxDQUM1QyxDQUFDO2FBQ0w7WUFDRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkQsTUFBTSxNQUFNLEdBQWtCO2dCQUMxQixJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU07Z0JBQzFELE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBUSxDQUFDLEtBQUssRUFBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTtnQkFDL0QsU0FBUyxFQUFFLFNBQVM7Z0JBQ3BCLElBQUksRUFBRSxFQUFFO2FBQ1gsQ0FBQztZQUNGLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBQSxNQUFNLENBQUMsTUFBTSwwQ0FBRSxXQUFXLEtBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDakUsTUFBTSxhQUFhLEdBQWtCLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQztZQUMzRCxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDcEM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLElBQUksR0FBRyxZQUFZLDBCQUFjLEVBQUU7Z0JBQy9CLE9BQU8sZUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3hDO2lCQUFNO2dCQUNILGFBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDcEI7U0FDSjtJQUNMLENBQUM7SUFFUyxPQUFPLENBQUMsSUFBYTtRQUMzQixJQUFJLElBQUksRUFBRTtZQUNOLE9BQU8sQ0FDSCxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsd0JBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQywwQ0FBRSxRQUFRLENBQUMsSUFBSSxJQUFDLENBQUMsSUFBSSxRQUFRLENBQ25FLENBQUM7U0FDTDthQUFNO1lBQ0gsT0FBTyxPQUFPLENBQUM7U0FDbEI7SUFDTCxDQUFDO0NBQ0o7QUFFRCxrQkFBZSxPQUFPLENBQUMifQ==