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
exports.default = new Command_1.default({
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
    visibility: "public",
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
    },
});
