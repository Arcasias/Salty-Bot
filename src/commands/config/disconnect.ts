import salty from "../../salty";
import { answers } from "../../strings";
import { CommandDescriptor } from "../../typings";
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

  async action({ send }) {
    await send.info(`${choice(answers.bye)} ♥`);
    await salty.destroy();
  },
};

export default command;
