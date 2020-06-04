import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { answers as listAnswers, meaning } from "../../terms";
import { choice, clean } from "../../utils";

Command.register({
    name: "talk",
    category: "text",
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***anything***",
            effect:
                'I\'ll answer to what you said. As I\'m not a really advanced AI, you may want to try simple things such as "Hello" or "How are you"',
        },
    ],

    async action({ args, msg }) {
        const cleanedMsg = " " + args.map((arg) => clean(arg)).join(" ") + " ";
        const meanFound: string[] = [];
        const answers: string[] = [];

        for (const mean in meaning) {
            for (const term of meaning[mean].list) {
                if (
                    !meanFound.includes(mean) &&
                    cleanedMsg.match(new RegExp(" " + term + " ", "g"))
                ) {
                    meanFound.push(mean);
                }
            }
        }
        if (meanFound.length) {
            for (const meaningFound of meanFound) {
                for (const answerType of meaning[meaningFound].answers) {
                    answers.push(choice(listAnswers[answerType]));
                }
            }
            await Salty.message(msg, answers.join(", "));
        } else {
            const random: string[] = listAnswers.rand;
            await Salty.message(msg, choice(random));
        }
    },
});