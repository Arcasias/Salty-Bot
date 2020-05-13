"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const Salty_1 = __importDefault(require("../../classes/Salty"));
const User_1 = __importDefault(require("../../classes/User"));
const terms_1 = require("../../terms");
class TodoCommand extends Command_1.default {
    constructor() {
        super(...arguments);
        this.name = "todo";
        this.keys = ["todos"];
        this.help = [
            {
                argument: null,
                effect: "Shows your todo list",
            },
            {
                argument: "***something to do***",
                effect: "Adds something to your todo list",
            },
        ];
    }
    async action({ args, msg }) {
        let user = User_1.default.get(msg.author.id);
        if (args[0] && terms_1.remove.includes(args[0])) {
            let todoList = user.todo;
            if (0 === todoList.length) {
                throw new Exception_1.SaltyException("your todo list is empty");
            }
            if (!args[1] || !todoList[parseInt(args[1]) - 1]) {
                throw new Exception_1.OutOfRange(Number(args[1]));
            }
            user.todo.splice(parseInt(args[1]) - 1, 1);
            Salty_1.default.success(msg, `item number **${args[1]}** removed from your todo list`);
        }
        else if (args[0] && terms_1.remove.includes(args[0])) {
            user.todo = [];
            Salty_1.default.message(msg, "your todo list has been cleared");
        }
        else {
            if ((args[0] && terms_1.list.includes(args[0])) || !args[0]) {
                if (0 === user.todo.length) {
                    throw new Exception_1.EmptyObject("your todo list");
                }
                Salty_1.default.embed(msg, {
                    title: "<authors> todo list",
                    description: `> ${user.todo.join("\n> ")}`,
                });
            }
            else {
                user.todo.push(args.join(" "));
                Salty_1.default.message(msg, `I added "**${args.join(" ")}**" to your todo list`);
            }
        }
    }
}
exports.default = TodoCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9nZW5lcmFsL3RvZG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBK0Q7QUFDL0QsdURBSWlDO0FBQ2pDLGdFQUF3QztBQUN4Qyw4REFBc0M7QUFDdEMsdUNBQTJDO0FBRTNDLE1BQU0sV0FBWSxTQUFRLGlCQUFPO0lBQWpDOztRQUNXLFNBQUksR0FBRyxNQUFNLENBQUM7UUFDZCxTQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqQixTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsc0JBQXNCO2FBQ2pDO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLHVCQUF1QjtnQkFDakMsTUFBTSxFQUFFLGtDQUFrQzthQUM3QztTQUNKLENBQUM7SUF5Q04sQ0FBQztJQXZDRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBaUI7UUFDckMsSUFBSSxJQUFJLEdBQUcsY0FBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRW5DLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLGNBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDckMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztZQUV6QixJQUFJLENBQUMsS0FBSyxRQUFRLENBQUMsTUFBTSxFQUFFO2dCQUN2QixNQUFNLElBQUksMEJBQWMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO2FBQ3ZEO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQzlDLE1BQU0sSUFBSSxzQkFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3pDO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUUzQyxlQUFLLENBQUMsT0FBTyxDQUNULEdBQUcsRUFDSCxpQkFBaUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxnQ0FBZ0MsQ0FDM0QsQ0FBQztTQUNMO2FBQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksY0FBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM1QyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNmLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLGlDQUFpQyxDQUFDLENBQUM7U0FDekQ7YUFBTTtZQUNILElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksWUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNqRCxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDeEIsTUFBTSxJQUFJLHVCQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztpQkFDM0M7Z0JBQ0QsZUFBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7b0JBQ2IsS0FBSyxFQUFFLHFCQUFxQjtvQkFDNUIsV0FBVyxFQUFFLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7aUJBQzdDLENBQUMsQ0FBQzthQUNOO2lCQUFNO2dCQUNILElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsZUFBSyxDQUFDLE9BQU8sQ0FDVCxHQUFHLEVBQ0gsY0FBYyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FDdEQsQ0FBQzthQUNMO1NBQ0o7SUFDTCxDQUFDO0NBQ0o7QUFFRCxrQkFBZSxXQUFXLENBQUMifQ==