import SaltyModule from "../classes/SaltyModule";
import { CommandDescriptor } from "../typings";
import { ellipsis, randInt, shuffle } from "../utils/generic";

const PREDICTIONS: string[] = [
  "changer de sexe",
  "cuisiner avec Raph",
  "cuisiner Raph",
  "chier sur la voiture de Killian",
  "devenir l'esclave de Valerr",
  "devenir président des îles vierges",
  "émasculer Louis",
  "envoyer une photo d'orteils à Julien",
  "faire du surf avec Thu Lan",
  "faire une julienne de Julien",
  "jouer aux échecs",
  "manger une glace",
  "obtenir un rat",
  "offrir des chaussures à Louis",
  "offrir des paquets à Killian",
  "préparer des crêpes",
  "ramener Thu Lan en bronze 4",
  "résoudre des équations",
  "ruiner le TFE de Valerr",
  "se faire écraser",
  "se faire tabasser par Madi",
  "sortir avec un noir",
  "tomber en dépression",
  "tondre Madi",
];

const futureCommand: CommandDescriptor = {
  name: "future",
  aliases: ["predict"],
  guilds: ["519974305388560393"],

  async action({ send }) {
    const pred = [];
    for (const prediction of PREDICTIONS) {
      pred.push(...new Array(randInt(2, 4)).fill(prediction));
    }
    const shuffled = shuffle(pred);
    const ellipsed = ellipsis(shuffled.join(" ||||"), 1995);
    return send.message(`||${ellipsed}||`);
  },
};

export default class TbkkModule extends SaltyModule {
  public commands = { misc: [futureCommand] };
}
