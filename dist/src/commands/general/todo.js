"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Exception_1 = require("../../classes/Exception");
const Salty_1 = __importDefault(require("../../classes/Salty"));
const User_1 = __importDefault(require("../../classes/User"));
const list_1 = require("../../list");
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
    async action({ msg, args }) {
        let user = User_1.default.get(msg.author.id);
        if (args[0] && list_1.remove.includes(args[0])) {
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
        else if (args[0] && list_1.remove.includes(args[0])) {
            user.todo = [];
            Salty_1.default.message(msg, "your todo list has been cleared");
        }
        else {
            if ((args[0] && list_1.list.includes(args[0])) || !args[0]) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21tYW5kcy9nZW5lcmFsL3RvZG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBNEM7QUFDNUMsdURBSWlDO0FBQ2pDLGdFQUF3QztBQUN4Qyw4REFBc0M7QUFDdEMscUNBQTBDO0FBRTFDLE1BQU0sV0FBWSxTQUFRLGlCQUFPO0lBQWpDOztRQUNXLFNBQUksR0FBRyxNQUFNLENBQUM7UUFDZCxTQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqQixTQUFJLEdBQUc7WUFDVjtnQkFDSSxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsc0JBQXNCO2FBQ2pDO1lBQ0Q7Z0JBQ0ksUUFBUSxFQUFFLHVCQUF1QjtnQkFDakMsTUFBTSxFQUFFLGtDQUFrQzthQUM3QztTQUNKLENBQUM7SUF5Q04sQ0FBQztJQXZDRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtRQUN0QixJQUFJLElBQUksR0FBRyxjQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFbkMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksYUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNyQyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBRXpCLElBQUksQ0FBQyxLQUFLLFFBQVEsQ0FBQyxNQUFNLEVBQUU7Z0JBQ3ZCLE1BQU0sSUFBSSwwQkFBYyxDQUFDLHlCQUF5QixDQUFDLENBQUM7YUFDdkQ7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDOUMsTUFBTSxJQUFJLHNCQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDekM7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRTNDLGVBQUssQ0FBQyxPQUFPLENBQ1QsR0FBRyxFQUNILGlCQUFpQixJQUFJLENBQUMsQ0FBQyxDQUFDLGdDQUFnQyxDQUMzRCxDQUFDO1NBQ0w7YUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxhQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzVDLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ2YsZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsaUNBQWlDLENBQUMsQ0FBQztTQUN6RDthQUFNO1lBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxXQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2pELElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUN4QixNQUFNLElBQUksdUJBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2lCQUMzQztnQkFDRCxlQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtvQkFDYixLQUFLLEVBQUUscUJBQXFCO29CQUM1QixXQUFXLEVBQUUsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtpQkFDN0MsQ0FBQyxDQUFDO2FBQ047aUJBQU07Z0JBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixlQUFLLENBQUMsT0FBTyxDQUNULEdBQUcsRUFDSCxjQUFjLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUN0RCxDQUFDO2FBQ0w7U0FDSjtJQUNMLENBQUM7Q0FDSjtBQUVELGtCQUFlLFdBQVcsQ0FBQyJ9