"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const User_1 = __importDefault(require("../../classes/User"));
const terms_1 = require("../../terms");
Command_1.default.register({
    name: "todo",
    keys: ["todos"],
    help: [
        {
            argument: null,
            effect: "Shows your todo list",
        },
        {
            argument: "***something to do***",
            effect: "Adds something to your todo list",
        },
    ],
    async action({ args, msg }) {
        const user = User_1.default.get(msg.author.id);
        if (args.length && terms_1.remove.includes(args[0])) {
            if (!user.todos.length) {
                return Salty_1.default.warn(msg, "Your todo list is empty.");
            }
            const targetIndex = Number(args[1]) - 1;
            if (!args[1] || !user.todos[targetIndex]) {
                return Salty_1.default.warn(msg, `Your todo list has ${user.todos.length} items: ${targetIndex} is out of range.`);
            }
            user.todos.splice(targetIndex, 1);
            Salty_1.default.success(msg, `item number **${args[1]}** removed from your todo list`);
        }
        else if (args.length && terms_1.remove.includes(args[0])) {
            await User_1.default.update(user.id, { todos: [] });
            Salty_1.default.success(msg, "Your todo list has been cleared.");
        }
        else {
            if ((args[0] && terms_1.list.includes(args[0])) || !args[0]) {
                if (!user.todos.length) {
                    return Salty_1.default.warn(msg, "Your todo list is empty.");
                }
                Salty_1.default.embed(msg, {
                    title: "<authors> todo list",
                    description: `> ${user.todos.join("\n> ")}`,
                });
            }
            else {
                const newTodo = args.join(" ");
                const todos = [...user.todos, newTodo];
                await User_1.default.update(user.id, { todos });
                Salty_1.default.success(msg, `I added "**${newTodo}**" to your todo list.`);
            }
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9kby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21tYW5kcy9nZW5lcmFsL3RvZG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBNEM7QUFDNUMsZ0VBQXdDO0FBQ3hDLDhEQUFzQztBQUN0Qyx1Q0FBMkM7QUFFM0MsaUJBQU8sQ0FBQyxRQUFRLENBQUM7SUFDYixJQUFJLEVBQUUsTUFBTTtJQUNaLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQztJQUNmLElBQUksRUFBRTtRQUNGO1lBQ0ksUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsc0JBQXNCO1NBQ2pDO1FBQ0Q7WUFDSSxRQUFRLEVBQUUsdUJBQXVCO1lBQ2pDLE1BQU0sRUFBRSxrQ0FBa0M7U0FDN0M7S0FDSjtJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO1FBQ3RCLE1BQU0sSUFBSSxHQUFHLGNBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUUsQ0FBQztRQUV0QyxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksY0FBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQ3BCLE9BQU8sZUFBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsMEJBQTBCLENBQUMsQ0FBQzthQUN0RDtZQUNELE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQ3RDLE9BQU8sZUFBSyxDQUFDLElBQUksQ0FDYixHQUFHLEVBQ0gsc0JBQXNCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxXQUFXLFdBQVcsbUJBQW1CLENBQ25GLENBQUM7YUFDTDtZQUNELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUVsQyxlQUFLLENBQUMsT0FBTyxDQUNULEdBQUcsRUFDSCxpQkFBaUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxnQ0FBZ0MsQ0FDM0QsQ0FBQztTQUNMO2FBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLGNBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDaEQsTUFBTSxjQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMxQyxlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxrQ0FBa0MsQ0FBQyxDQUFDO1NBQzFEO2FBQU07WUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLFlBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDakQsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO29CQUNwQixPQUFPLGVBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLDBCQUEwQixDQUFDLENBQUM7aUJBQ3REO2dCQUNELGVBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO29CQUNiLEtBQUssRUFBRSxxQkFBcUI7b0JBQzVCLFdBQVcsRUFBRSxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2lCQUM5QyxDQUFDLENBQUM7YUFDTjtpQkFBTTtnQkFDSCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMvQixNQUFNLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDdkMsTUFBTSxjQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUN0QyxlQUFLLENBQUMsT0FBTyxDQUNULEdBQUcsRUFDSCxjQUFjLE9BQU8sd0JBQXdCLENBQ2hELENBQUM7YUFDTDtTQUNKO0lBQ0wsQ0FBQztDQUNKLENBQUMsQ0FBQyJ9