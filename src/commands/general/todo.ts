import Sailor from "../../classes/Sailor";
import { CommandDescriptor } from "../../typings";
import { clean, levenshtein, meaning } from "../../utils/generic";

const command: CommandDescriptor = {
  name: "todo",
  aliases: ["todos"],
  help: [
    {
      argument: null,
      effect: "Shows your todo list",
    },
    {
      argument: "`something to do`",
      effect: "Adds something to your todo list",
    },
  ],

  async action({ args, send, source }) {
    const { todos } = source.sailor;
    switch (meaning(args[0])) {
      case "remove": {
        if (!todos.length) {
          return send.info("Your todo list is empty.");
        }
        if (!args[1]) {
          return send.warn(`You need to tell me what item to remove.`);
        }
        let targetIndex: number;
        if (!isNaN(Number(args[1]))) {
          targetIndex = Number(args[1]) - 1;
          if (!todos[targetIndex]) {
            return send.warn(
              `Your todo list has ${todos.length} items: ${args[1]} is out of range.`
            );
          }
        } else {
          targetIndex = todos.findIndex(
            (todo: string) => levenshtein(clean(args[1]), clean(todo)) <= 1
          );
          if (targetIndex < 0) {
            return send.warn(`No todo item matching "${args[1]}".`);
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
        return send.success(`"**${removed!}**" removed from your todo list`);
      }
      case "clear": {
        await Sailor.update(source.sailor.id, { todos: [] });
        return send.success("Your todo list has been cleared.");
      }
      case "list":
      case null: {
        if (!todos.length) {
          return send.info("Your todo list is empty.");
        }
        return send.embed({
          title: "<authors> todo list",
          description: todos.map((todo: string) => `• ${todo}`).join("\n"),
        });
      }
      default: {
        const newTodo = args.join(" ");
        await Sailor.update(source.sailor.id, {
          todos: [...todos, newTodo],
        });
        return send.success(`I added "**${newTodo}**" to your todo list.`);
      }
    }
  },
};

export default command;
