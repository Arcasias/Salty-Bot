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
    public: null,
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
        this.keys = [];
        this.visibility = "public";
    }
    async run(msg, args) {
        try {
            if (this.visibility !== "public" &&
                !permissions[this.visibility].call(Salty_1.default, msg.author, msg.guild)) {
                throw new Exception_1.PermissionDenied(this.visibility);
            }
            if (this.env && this.env !== process.env.MODE) {
                utils_1.debug(this.name, this.env);
                throw new Exception_1.SaltyException("WrongEnvironment", "it looks like I'm not in the right environment to do that");
            }
            const mentioned = Boolean(msg.mentions.users.size);
            const target = {
                user: mentioned ? msg.mentions.users.first() : msg.author,
                member: mentioned ? msg.mentions.members.first() : msg.member,
                isMention: mentioned,
            };
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
            return (MEANING_ACTIONS.find((w) => list[w] && list[w].includes(word)) || "string");
        }
        else {
            return "noarg";
        }
    }
}
exports.default = Command;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGFzc2VzL0NvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0Esb0NBQXdDO0FBQ3hDLDJDQUErRDtBQUMvRCxvREFBNEI7QUFDNUIsK0NBQWlDO0FBRWpDLE1BQU0sV0FBVyxHQUFHO0lBQ2hCLE1BQU0sRUFBRSxJQUFJO0lBQ1osS0FBSyxFQUFFLGVBQUssQ0FBQyxPQUFPO0lBQ3BCLEdBQUcsRUFBRSxlQUFLLENBQUMsS0FBSztJQUNoQixLQUFLLEVBQUUsZUFBSyxDQUFDLE9BQU87Q0FDdkIsQ0FBQztBQUNGLE1BQU0sZUFBZSxHQUFHO0lBQ3BCLEtBQUs7SUFDTCxRQUFRO0lBQ1IsT0FBTztJQUNQLE1BQU07SUFDTixLQUFLO0lBQ0wsS0FBSztJQUNMLE1BQU07Q0FDVCxDQUFDO0FBcUJGLE1BQWUsT0FBTztJQUF0QjtRQUdvQixTQUFJLEdBQWEsRUFBRSxDQUFDO1FBR3BCLGVBQVUsR0FBcUIsUUFBUSxDQUFDO0lBa0Q1RCxDQUFDO0lBM0NVLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBWSxFQUFFLElBQWM7UUFDekMsSUFBSTtZQUNBLElBQ0ksSUFBSSxDQUFDLFVBQVUsS0FBSyxRQUFRO2dCQUM1QixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFDbEU7Z0JBQ0UsTUFBTSxJQUFJLDRCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUMvQztZQUNELElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxLQUFLLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFO2dCQUMzQyxhQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQzNCLE1BQU0sSUFBSSwwQkFBYyxDQUNwQixrQkFBa0IsRUFDbEIsMkRBQTJELENBQzlELENBQUM7YUFDTDtZQUNELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuRCxNQUFNLE1BQU0sR0FBa0I7Z0JBQzFCLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTtnQkFDekQsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNO2dCQUM3RCxTQUFTLEVBQUUsU0FBUzthQUN2QixDQUFDO1lBQ0YsTUFBTSxhQUFhLEdBQWtCLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQztZQUMzRCxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDcEM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNWLElBQUksR0FBRyxZQUFZLDBCQUFjLEVBQUU7Z0JBQy9CLE9BQU8sZUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3hDO2lCQUFNO2dCQUNILGFBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDcEI7U0FDSjtJQUNMLENBQUM7SUFFUyxPQUFPLENBQUMsSUFBYTtRQUMzQixJQUFJLElBQUksRUFBRTtZQUNOLE9BQU8sQ0FDSCxlQUFlLENBQUMsSUFBSSxDQUNoQixDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQzNDLElBQUksUUFBUSxDQUNoQixDQUFDO1NBQ0w7YUFBTTtZQUNILE9BQU8sT0FBTyxDQUFDO1NBQ2xCO0lBQ0wsQ0FBQztDQUNKO0FBRUQsa0JBQWUsT0FBTyxDQUFDIn0=