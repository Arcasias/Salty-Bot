import salty from "../../salty";
import { fault } from "../../strings";
import { CommandDescriptor } from "../../typings";
import { choice } from "../../utils";

const command: CommandDescriptor = {
  name: "fault",
  aliases: ["overwatch", "reason"],
  help: [
    {
      argument: null,
      effect: "Check whose fault it is",
    },
  ],

  async action({ msg }) {
    const text = (choice(fault.start) + choice(fault.sentence))
      .replace(/<subject>/g, choice(fault.subject))
      .replace(/<reason>/g, choice(fault.reason))
      .replace(/<punishment>/g, choice(fault.punishment));

    await salty.message(msg, text);
  },
};

export default command;
