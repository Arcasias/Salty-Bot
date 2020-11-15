import Command from "../../classes/Command";
import salty from "../../salty";
import { jokes } from "../../terms";
import { Dictionnary, Joke } from "../../types";
import { randInt } from "../../utils";

const cache: Dictionnary<Joke[]> = {};

Command.register({
  name: "joke",
  aliases: ["fun", "haha", "jest", "joker", "jokes"],
  category: "misc",
  help: [
    {
      argument: null,
      effect: "Tells some spicy jokes!",
    },
  ],

  async action({ msg }) {
    if (!(msg.author.username in cache)) {
      cache[msg.author.username] = jokes.slice();
    }
    const jokeIndex = randInt(0, cache[msg.author.username].length);
    const [joke] = cache[msg.author.username].splice(jokeIndex, 1);
    if (!cache[msg.author.username].length) {
      delete cache[msg.author.username];
    }
    const answer = joke.answer ? `\n\n||${joke.answer}||` : "";
    await salty.message(msg, joke.text + answer);
  },
});
