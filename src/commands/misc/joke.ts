import { jokes } from "../../strings";
import { CommandDescriptor, Dictionnary, Joke } from "../../typings";
import { randInt } from "../../utils/generic";

const cache: Dictionnary<Joke[]> = {};

const command: CommandDescriptor = {
  name: "joke",
  aliases: ["fun", "haha", "jest", "joker", "jokes"],
  help: [
    {
      argument: null,
      effect: "Tells some spicy jokes!",
    },
  ],

  async action({ msg, send }) {
    if (!(msg.author.username in cache)) {
      cache[msg.author.username] = jokes.slice();
    }
    const jokeIndex = randInt(0, cache[msg.author.username].length - 1);
    const [joke] = cache[msg.author.username].splice(jokeIndex, 1);
    if (!cache[msg.author.username].length) {
      delete cache[msg.author.username];
    }
    const answer = joke.answer ? `\n\n||${joke.answer}||` : "";
    await send.message(joke.text + answer);
  },
};

export default command;
