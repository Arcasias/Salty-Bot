import Command from "../../classes/Command";
import salty from "../../salty";
import { predictions } from "../../terms";
import { ellipsis, randInt, shuffle } from "../../utils";

Command.register({
  name: "future",
  aliases: ["predict"],
  category: "misc",
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
});
