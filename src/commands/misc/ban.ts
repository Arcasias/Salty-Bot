import { CommandDescriptor } from "../../typings";
import { choice } from "../../utils/generic";

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

    const { txt, react } = choice([
      {
        txt: `The merciless ban hammer has fallen onto ${nameString}. May they rest in pieces. (... uhhh looks like it didn't work)`,
        react: "🔨",
      },
      { txt: `Uhhh there is no proper ban command yet.` },
      {
        txt: `You know you can just right click and ban them yourself.`,
      },
      { txt: `Nah. Not banning this one.`, react: "❌" },
      {
        txt: `This is a very strong punishment. Do you really want to ban ${nameString}?`,
      },
      {
        txt: `You merciless prick! Did you really want to get rid of ${nameString}?`,
      },
    ]);
    return send.success(txt, { react });
  },
};

export default command;
