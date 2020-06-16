import { debug } from "console";
import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import User from "../../classes/User";
import { clean, levenshtein, meaning } from "../../utils";

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
            case "add":
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
                    return Salty.info(msg, "Your todo list is empty.");
                }
                if (!args[1]) {
                    return Salty.warn(
                        msg,
                        `You need to tell me what item to remove.`
                    );
                }
                let targetIndex: number;
                if (!isNaN(Number(args[1]))) {
                    targetIndex = Number(args[1]) - 1;
                    if (!user.todos[targetIndex]) {
                        return Salty.warn(
                            msg,
                            `Your todo list has ${user.todos.length} items: ${args[1]} is out of range.`
                        );
                    }
                } else {
                    targetIndex = user.todos.findIndex(
                        (todo: string) =>
                            levenshtein(clean(args[1]), clean(todo)) <= 1
                    );
                    if (targetIndex < 0) {
                        return Salty.warn(
                            msg,
                            `No todo item matching "${args[1]}".`
                        );
                    }
                }
                const todos: string[] = [];
                let removed: string;
                for (let i = 0; i < user.todos.length; i++) {
                    if (i === targetIndex) {
                        removed = user.todos[i];
                    } else {
                        todos.push(user.todos[i]);
                    }
                }
                await User.update(user.id, { todos });
                return Salty.success(
                    msg,
                    `"**${removed!}**" removed from your todo list`
                );
            }
            case "clear": {
                await User.update(user.id, { todos: [] });
                return Salty.success(msg, "Your todo list has been cleared.");
            }
            default: {
                if (!user.todos.length) {
                    return Salty.info(msg, "Your todo list is empty.");
                }
                debug({ todos: user.todos });
                return Salty.embed(msg, {
                    title: "<authors> todo list",
                    description: user.todos
                        .map((todo: string) => `• ${todo}`)
                        .join("\n"),
                });
            }
        }
    },
});
