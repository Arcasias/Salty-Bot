import { CommandDescriptor } from "../../typings";
import { getHistory } from "../../utils/log";

const command: CommandDescriptor = {
  name: "log",
  aliases: ["logs", "history", "audit"],
  async action({ send }) {
    const description: string = getHistory()
      .map((l) => `${l.type}: ${l.message}`)
      .join("\n");
    return send.info("Log history", { description });
  },
};

export default command;
