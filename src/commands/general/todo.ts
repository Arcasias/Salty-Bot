import Command from "../../classes/Command";
import Sailor from "../../classes/Sailor";
import salty from "../../salty";
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

    async action({ args, msg, source }) {
        const { todos } = source.sailor;
        switch (meaning(args[0])) {
            case "remove": {
                if (!todos.length) {
                    return salty.info(msg, "Your todo list is empty.");
                }
                if (!args[1]) {
                    return salty.warn(
                        msg,
                        `You need to tell me what item to remove.`
                    );
                }
                let targetIndex: number;
                if (!isNaN(Number(args[1]))) {
                    targetIndex = Number(args[1]) - 1;
                    if (!todos[targetIndex]) {
                        return salty.warn(
                            msg,
                            `Your todo list has ${todos.length} items: ${args[1]} is out of range.`
                        );
                    }
                } else {
                    targetIndex = todos.findIndex(
                        (todo: string) =>
                            levenshtein(clean(args[1]), clean(todo)) <= 1
                    );
                    if (targetIndex < 0) {
                        return salty.warn(
                            msg,
                            `No todo item matching "${args[1]}".`
                        );
                    }
                }
                const newTodos: string[] = [];
                let removed: string;
                for (let i = 0; i < todos.length; i++) {
                    if (i === targetIndex) {
                        removed = todos[i];
                    } else {
                        newTodos.push(todos[i]);
                    }
                }
                await Sailor.update(source.sailor.id, { todos: newTodos });
                return salty.success(
                    msg,
                    `"**${removed!}**" removed from your todo list`
                );
            }
            case "clear": {
                await Sailor.update(source.sailor.id, { todos: [] });
                return salty.success(msg, "Your todo list has been cleared.");
            }
            case "list":
            case null: {
                if (!todos.length) {
                    return salty.info(msg, "Your todo list is empty.");
                }
                return salty.embed(msg, {
                    title: "<authors> todo list",
                    description: todos
                        .map((todo: string) => `• ${todo}`)
                        .join("\n"),
                });
            }
            default: {
                const newTodo = args.join(" ");
                await Sailor.update(source.sailor.id, {
                    todos: [...todos, newTodo],
                });
                return salty.success(
                    msg,
                    `I added "**${newTodo}**" to your todo list.`
                );
            }
        }
    },
});
