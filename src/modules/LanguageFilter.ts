import { Message } from "discord.js";
import salty from "../salty";
import { answers, meaning } from "../strings";
import { Module } from "../typings";
import { choice } from "../utils/generic";

const SWEAR_WORDS = meaning.badWord.list;

const LanguageFilterModule: Module = {
  async onMessage(msg: Message) {
    for (const word of msg.cleanContent.split(/\s+/)) {
      if (SWEAR_WORDS.includes(word)) {
        salty.message(msg, choice(answers.rude), { replyTo: msg });
      }
    }
  },
};

export default LanguageFilterModule;
