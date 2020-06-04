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
    aliases: ["todos"],
    category: "general",
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
