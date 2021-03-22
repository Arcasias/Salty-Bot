import { Message } from "discord.js";
import SaltyModule from "../classes/SaltyModule";
import { answers, meaning } from "../strings";
import { choice } from "../utils/generic";

const SWEAR_WORDS = meaning.badWord.list;

export default class LanguageFilterModule extends SaltyModule {
  public callbacks = [{ method: "message", callback: this.onMessage }];

  private async onMessage(msg: Message) {
    for (const word of msg.cleanContent.split(/\s+/)) {
      if (SWEAR_WORDS.includes(word)) {
        this.salty.message(msg, choice(answers.rude), { reply: msg });
      }
    }
  }
}
