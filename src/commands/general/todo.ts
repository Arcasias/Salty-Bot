import Command from "../../classes/Command";
import {
    EmptyObject,
    OutOfRange,
    SaltyException,
} from "../../classes/Exception";
import Salty from "../../classes/Salty";
import User from "../../classes/User";
import { list, remove } from "../../data/list";

export default new Command({
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
    async action(msg, args) {
        let user = User.get(msg.author.id);

        if (args[0] && remove.includes(args[0])) {
            let todoList = user.todo;

            if (0 === todoList.length) {
                throw new SaltyException("your todo list is empty");
            }
            if (!args[1] || !todoList[parseInt(args[1]) - 1]) {
                throw new OutOfRange(args[1]);
            }
            user.todo.splice(parseInt(args[1]) - 1, 1);

            Salty.success(
                msg,
                `item number **${args[1]}** removed from your todo list`
            );
        } else if (args[0] && remove.includes(args[0])) {
            user.todo = [];
            Salty.message(msg, "your todo list has been cleared");
        } else {
            if ((args[0] && list.includes(args[0])) || !args[0]) {
                if (0 === user.todo.length) {
                    throw new EmptyObject("your todo list");
                }
                Salty.embed(msg, {
                    title: "<author>'s todo list",
                    description: `> ${user.todo.join("\n> ")}`,
                });
            } else {
                user.todo.push(args.join(" "));
                Salty.message(
                    msg,
                    `I added "**${args.join(" ")}**" to your todo list`
                );
            }
        }
    },
});
