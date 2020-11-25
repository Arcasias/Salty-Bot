import salty from "../../salty";
import { answers } from "../../terms";
import { CommandDescriptor } from "../../types";
import { choice } from "../../utils";

const command: CommandDescriptor = {
  name: "disconnect",
  aliases: ["destroy"],
  help: [
    {
      argument: null,
      effect:
        "Disconnects me and terminates my program. Think wisely before using this one, ok?",
    },
  ],
  access: "dev",

  async action({ msg }) {
    await salty.info(msg, `${choice(answers.bye)} ♥`);
    await salty.destroy();
  },
};

export default command;
