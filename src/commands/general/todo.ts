import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import User from "../../classes/User";
import { meaning } from "../../utils";

Command.register({
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
        const user = User.get(msg.author.id)!;

        switch (meaning(args[0])) {
            case "string": {
                const newTodo = args.join(" ");
                const todos = [...user.todos, newTodo];
                await User.update(user.id, { todos });
                return Salty.success(
                    msg,
                    `I added "**${newTodo}**" to your todo list.`
                );
            }
            case "remove": {
                if (!user.todos.length) {
                    return Salty.warn(msg, "Your todo list is empty.");
                }
                const targetIndex = Number(args[1]) - 1;
                if (!args[1] || !user.todos[targetIndex]) {
                    return Salty.warn(
                        msg,
                        `Your todo list has ${user.todos.length} items: ${targetIndex} is out of range.`
                    );
                }
                user.todos.splice(targetIndex, 1);
                return Salty.success(
                    msg,
                    `item number **${args[1]}** removed from your todo list`
                );
            }
            case "clear": {
                await User.update(user.id, { todos: [] });
                return Salty.success(msg, "Your todo list has been cleared.");
            }
            case "list":
            default: {
                if (!user.todos.length) {
                    return Salty.warn(msg, "Your todo list is empty.");
                }
                return Salty.embed(msg, {
                    title: "<authors> todo list",
                    description: `> ${user.todos.join("\n> ")}`,
                });
            }
        }
    },
});
