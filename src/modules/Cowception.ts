import { CommandDescriptor, Module } from "../typings";
import { choice } from "../utils/generic";

const start = [
  "",
  "Want to know why you lost? ",
  "Isn't it obvious? ",
  "I think it was pretty clear ",
];
const sentence = [
  "It was **<subject>**'s fault for <reason>. The punishment will be <punishment>",
  "You lost because **<subject>** was <reason> again. Sanction will be <punishment>",
  "Just ask **<subject>** to think twice before <reason>. This time the sentence will just be <punishment>",
];
const subject = [
  "Antoine",
  "Dorian",
  "Florent",
  "Julien",
  "Martin",
  "Ophélie",
  "that random pickup",
  "your mom",
];
const reason = [
  "not providing enough healing",
  "not healing you enough",
  "repeatedly committing suicide",
  "troll picking",
  "flaming",
  "toxic behaviour",
  "extremely toxic behaviour",
  "being a complete ass throughout the entire game",
  "picking Genji",
  "not taking a good counterpick",
  "saying the N-word",
  "constantly rushing head down into unnessecary fights",
  "being good while no one else was",
  "not knowing his own hero abilities",
  "not knowing how to play",
  "constantly crying",
  "being a pessimistic ass",
  "whining all the time",
];
const punishment = [
  "death",
  "seppuku",
  "sudoku",
  "an apple in the ass",
  "a bunch of apples in the ass",
  "a warning. It's ok for this time",
  "a pat on the head. At least it was well performed",
  "uninstalling Overwatch",
  "being assraped by a gang of 8 strong N-words",
];

const overwatchFaultCommand: CommandDescriptor = {
  name: "fault",
  aliases: ["overwatch", "reason"],
  help: [
    {
      argument: null,
      effect: "Check whose fault it is",
    },
  ],
  guilds: ["458332259947118601"],

  async action({ send }) {
    await send.message(
      (choice(start) + choice(sentence))
        .replace(/<subject>/g, choice(subject))
        .replace(/<reason>/g, choice(reason))
        .replace(/<punishment>/g, choice(punishment))
    );
  },
};

const cowceptionModule: Module = {
  commands: [{ category: "misc", command: overwatchFaultCommand }],
};

export default cowceptionModule;
