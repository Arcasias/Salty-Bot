import { CommandDescriptor } from "../../typings";
import { meaning } from "../../utils/generic";
import { clearHistory, getHistory } from "../../utils/log";

const command: CommandDescriptor = {
  name: "log",
  aliases: ["logs", "history", "audit"],
  async action({ args, msg, send }) {
    const { author, guild } = msg;
    switch (meaning(args[0])) {
      case "clear": {
        clearHistory(guild || author);
        return send.success("History cleared");
      }
      default: {
        const description: string = `\`\`\`${getHistory(guild || author).join(
          "\n"
        )}\`\`\``;
        return send.info("Log history", { description });
      }
    }
  },
};

export default command;
