import salty from "../../salty";
import { predictions } from "../../terms";
import { CommandDescriptor } from "../../types";
import { ellipsis, randInt, shuffle } from "../../utils";

const command: CommandDescriptor = {
  name: "future",
  aliases: ["predict"],
  help: [
    {
      argument: null,
      effect: "TODO: documentation",
    },
  ],

  async action({ msg }) {
    const pred = [];
    for (const prediction of predictions) {
      pred.push(...new Array(randInt(2, 4)).fill(prediction));
    }
    const shuffled = shuffle(pred);
    const ellipsed = ellipsis(shuffled.join(" ||||"), 1995);
    salty.message(msg, `||${ellipsed}||`);
  },
};

export default command;
