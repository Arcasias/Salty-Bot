import salty from "../../salty";
import { answers as listAnswers, meaning } from "../../terms";
import { CommandDescriptor } from "../../typings";
import { choice, clean, levenshtein } from "../../utils";

const SPECIAL_CHARS = /[;,\.\?\!'"]/g;

const command: CommandDescriptor = {
  name: "talk",
  help: [
    {
      argument: "***anything***",
      effect:
        'I\'ll answer to what you said. As I\'m not a really advanced AI, you may want to try simple things such as "Hello" or "How are you"',
    },
  ],

  async action({ args, msg }) {
    const cleanedMsg = args
      .map((arg) => clean(arg).replace(SPECIAL_CHARS, ""))
      .filter((w: string) => Boolean(w))
      .join(" ");
    const meaningFound: Set<string> = new Set();
    const answers: string[] = [];
    for (const mean in meaning) {
      for (const term of meaning[mean].list) {
        const threshold = Math.floor(Math.log(term.length));
        if (levenshtein(cleanedMsg, term) <= threshold) {
          meaningFound.add(mean);
        }
      }
    }
    if (meaningFound.size) {
      for (const found of meaningFound.values()) {
        for (const answerType of meaning[found].answers) {
          answers.push(choice(listAnswers[answerType]));
        }
      }
      await salty.message(msg, answers.join(", "));
    } else {
      const random: string[] = listAnswers.rand;
      await salty.message(msg, choice(random));
    }
  },
};

export default command;
