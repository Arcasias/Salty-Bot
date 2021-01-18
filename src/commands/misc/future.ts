import { predictions } from "../../strings";
import { CommandDescriptor } from "../../typings";
import { ellipsis, randInt, shuffle } from "../../utils/generic";

const command: CommandDescriptor = {
  name: "future",
  aliases: ["predict"],

  async action({ send }) {
    const pred = [];
    for (const prediction of predictions) {
      pred.push(...new Array(randInt(2, 4)).fill(prediction));
    }
    const shuffled = shuffle(pred);
    const ellipsed = ellipsis(shuffled.join(" ||||"), 1995);
    return send.message(`||${ellipsed}||`);
  },
};

export default command;
