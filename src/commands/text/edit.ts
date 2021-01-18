import { CommandDescriptor } from "../../typings";

const command: CommandDescriptor = {
  name: "edit",
  async action({ args, send }) {
    const msgId = args.shift();

    if (!msgId) {
      return send.warn("I need the id of the message to edit");
    }
  },
};

export default command;
