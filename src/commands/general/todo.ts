import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import User from "../../classes/User";
import { list, remove } from "../../terms";

Command.register({
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
        const user = User.get(msg.author.id)!;

        if (args.length && remove.includes(args[0])) {
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

            Salty.success(
                msg,
                `item number **${args[1]}** removed from your todo list`
            );
        } else if (args.length && remove.includes(args[0])) {
            await User.update(user.id, { todos: [] });
            Salty.success(msg, "Your todo list has been cleared.");
        } else {
            if ((args[0] && list.includes(args[0])) || !args[0]) {
                if (!user.todos.length) {
                    return Salty.warn(msg, "Your todo list is empty.");
                }
                Salty.embed(msg, {
                    title: "<authors> todo list",
                    description: `> ${user.todos.join("\n> ")}`,
                });
            } else {
                const newTodo = args.join(" ");
                const todos = [...user.todos, newTodo];
                await User.update(user.id, { todos });
                Salty.success(
                    msg,
                    `I added "**${newTodo}**" to your todo list.`
                );
            }
        }
    },
});
