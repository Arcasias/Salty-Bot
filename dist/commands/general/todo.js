"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../classes/Command"));
const Salty_1 = __importDefault(require("../../classes/Salty"));
const User_1 = __importDefault(require("../../classes/User"));
const utils_1 = require("../../utils");
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
        switch (utils_1.meaning(args[0])) {
            case "string": {
                const newTodo = args.join(" ");
                const todos = [...user.todos, newTodo];
                await User_1.default.update(user.id, { todos });
                return Salty_1.default.success(msg, `I added "**${newTodo}**" to your todo list.`);
            }
            case "remove": {
                if (!user.todos.length) {
                    return Salty_1.default.warn(msg, "Your todo list is empty.");
                }
                if (!args[1]) {
                    return Salty_1.default.warn(msg, `You need to tell me what item to remove.`);
                }
                let targetIndex;
                if (!isNaN(Number(args[1]))) {
                    targetIndex = Number(args[1]) - 1;
                    if (!user.todos[targetIndex]) {
                        return Salty_1.default.warn(msg, `Your todo list has ${user.todos.length} items: ${targetIndex} is out of range.`);
                    }
                }
                else {
                    targetIndex = user.todos.findIndex((todo) => utils_1.levenshtein(utils_1.clean(args[1]), utils_1.clean(todo)) <= 1);
                    if (targetIndex < 0) {
                        return Salty_1.default.warn(msg, `No todo item matching "${args[1]}".`);
                    }
                }
                const todos = [];
                let removed;
                for (let i = 0; i < user.todos.length; i++) {
                    if (i === targetIndex) {
                        removed = user.todos[i];
                    }
                    else {
                        todos.push(user.todos[i]);
                    }
                }
                await User_1.default.update(user.id, { todos });
                return Salty_1.default.success(msg, `"**${removed}**" removed from your todo list`);
            }
            case "clear": {
                await User_1.default.update(user.id, { todos: [] });
                return Salty_1.default.success(msg, "Your todo list has been cleared.");
            }
            default: {
                if (!user.todos.length) {
                    return Salty_1.default.warn(msg, "Your todo list is empty.");
                }
                return Salty_1.default.embed(msg, {
                    title: "<authors> todo list",
                    description: user.todos
                        .map((todo) => `• ${todo}`)
                        .join("\n"),
                });
            }
        }
    },
});
