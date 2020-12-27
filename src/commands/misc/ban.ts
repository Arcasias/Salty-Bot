import { CommandDescriptor } from "../../typings";

const command: CommandDescriptor = {
  name: "ban",
  aliases: ["bannish", "kick"],
  access: "admin",
  async action({ send, targets }) {
    if (!targets.length) {
      return send.warn("I think you're missing a target buddy");
    }
    const names = targets.map((t) => t.name);
    const nameString =
      names.length > 1
        ? names.slice(0, -1).join(", ") + " and " + names.pop()
        : names[0];
    await send.success(
      `The merciless ban hammer has fallen onto ${nameString}. May they rest in pieces.`,
      { react: "🔨" }
    );
  },
};

export default command;
