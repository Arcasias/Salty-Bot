import salty from "../../salty";
import { CommandDescriptor } from "../../typings";
import { meaning } from "../../utils/generic";
import { clearHistory, getHistory } from "../../utils/log";

const command: CommandDescriptor = {
  name: "history",
  aliases: ["logs", "log", "audit"],
  async action({ args, msg, send }) {
    const { author, guild } = msg;
    switch (meaning(args[0])) {
      case "clear": {
        if (guild && !salty.isDev(author)) {
          return send.warn("You must be a Salty dev to clear the logs.");
        }
        clearHistory(guild || author);
        return send.success("History cleared");
      }
      default: {
        const description: string = `\`\`\`${getHistory(guild || author)
          .slice(0, -1)
          .join("\n")}\`\`\``;
        return send.info("Log history", { description });
      }
    }
  },
};

export default command;
