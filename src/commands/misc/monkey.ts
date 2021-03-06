import { CommandDescriptor } from "../../typings";
import { isSorted, shuffle } from "../../utils/generic";

const MAX_LENGTH = 12; // Let's not get over ourselves shall we?

const command: CommandDescriptor = {
  name: "monkey",
  aliases: [
    "monke",
    "bogosort",
    "monkeysort",
    "permutationsort",
    "shotgunsort",
    "slowsort",
    "stupidsort",
  ],
  help: [
    {
      argument: null,
      effect: "Monkey sorts a 10 elements array",
    },
    {
      argument: "`array length`",
      effect:
        "Monkey sorts an array of the provided length (lowered to maximum 10, let's not make me explode shall we?)",
    },
  ],

  async action({ args, send }) {
    if (!args[0]) {
      return send.warn("Missing the length of the array.");
    }

    const length = Math.min(Number(args[0]), MAX_LENGTH);

    if (isNaN(length) || length < 1) {
      return send.warn(`Array length must be a number greater than 1.`);
    }

    const runningMsg = await send.message("monkey sorting ...");

    let tests = 0;
    let list: number[] = [];

    const sortingTime = await new Promise((resolve) => {
      for (let i = 0; i < length; i++) {
        list.push(i);
      }
      list = shuffle(list);
      tests = 0;

      const startTimeStamp = Date.now();

      while (!isSorted(list)) {
        list = shuffle(list);
        tests++;
      }
      resolve(Math.floor((Date.now() - startTimeStamp) / 100) / 10);
    });

    runningMsg.delete().catch();
    await send.info(
      `Monkey sort on a **${length}** element list took **${sortingTime}** seconds in **${tests}** tests`,
      { react: "🐒" }
    );
  },
};

export default command;
