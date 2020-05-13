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
const list = __importStar(require("../list"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWFuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGFzc2VzL0NvbW1hbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQ0Esb0NBQXdDO0FBQ3hDLDJDQUErRDtBQUMvRCxvREFBNEI7QUFDNUIsOENBQWdDO0FBRWhDLE1BQU0sV0FBVyxHQUFHO0lBQ2hCLE1BQU0sRUFBRSxJQUFJO0lBQ1osS0FBSyxFQUFFLGVBQUssQ0FBQyxPQUFPO0lBQ3BCLEdBQUcsRUFBRSxlQUFLLENBQUMsS0FBSztJQUNoQixLQUFLLEVBQUUsZUFBSyxDQUFDLE9BQU87Q0FDdkIsQ0FBQztBQUNGLE1BQU0sZUFBZSxHQUFHO0lBQ3BCLEtBQUs7SUFDTCxRQUFRO0lBQ1IsT0FBTztJQUNQLE1BQU07SUFDTixLQUFLO0lBQ0wsS0FBSztJQUNMLE1BQU07Q0FDVCxDQUFDO0FBcUJGLE1BQWUsT0FBTztJQUF0QjtRQU1vQixlQUFVLEdBQXFCLFFBQVEsQ0FBQztJQW9ENUQsQ0FBQztJQTNDVSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQVksRUFBRSxJQUFjO1FBQ3pDLElBQUk7WUFDQSxJQUNJLElBQUksQ0FBQyxVQUFVLEtBQUssUUFBUTtnQkFDNUIsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQ2xFO2dCQUNFLE1BQU0sSUFBSSw0QkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDL0M7WUFDRCxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRTtnQkFDM0MsYUFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMzQixNQUFNLElBQUksMEJBQWMsQ0FDcEIsa0JBQWtCLEVBQ2xCLDJEQUEyRCxDQUM5RCxDQUFDO2FBQ0w7WUFDRCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkQsTUFBTSxNQUFNLEdBQWtCO2dCQUMxQixJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU07Z0JBQ3pELE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTTtnQkFDN0QsU0FBUyxFQUFFLFNBQVM7YUFDdkIsQ0FBQztZQUNGLE1BQU0sYUFBYSxHQUFrQixFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUM7WUFDM0QsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3BDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDVixJQUFJLEdBQUcsWUFBWSwwQkFBYyxFQUFFO2dCQUMvQixPQUFPLGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUN4QztpQkFBTTtnQkFDSCxhQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3BCO1NBQ0o7SUFDTCxDQUFDO0lBRVMsT0FBTyxDQUFDLElBQWE7UUFDM0IsSUFBSSxJQUFJLEVBQUU7WUFDTixPQUFPLENBQ0gsZUFBZSxDQUFDLElBQUksQ0FDaEIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUMzQyxJQUFJLFFBQVEsQ0FDaEIsQ0FBQztTQUNMO2FBQU07WUFDSCxPQUFPLE9BQU8sQ0FBQztTQUNsQjtJQUNMLENBQUM7Q0FDSjtBQUVELGtCQUFlLE9BQU8sQ0FBQyJ9