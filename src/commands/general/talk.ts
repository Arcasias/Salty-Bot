import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { choice, clean } from "../../utils";
import { answers as listAnswers, meaning } from "../../data/list";

export default new Command({
    name: "talk",
    keys: [],
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
    visibility: "public",
    async action(msg, args) {
        let cleanedMsg = " " + args.map((arg) => clean(arg)).join(" ") + " ";
        let meanFound = [];
        let answers = [];

        for (let mean in meaning) {
            for (let i = 0; i < meaning[mean].list.length; i++) {
                if (
                    !meanFound.includes(mean) &&
                    cleanedMsg.match(
                        new RegExp(" " + meaning[mean].list[i] + " ", "g")
                    )
                ) {
                    meanFound.push(mean);
                }
            }
        }
        if (0 < meanFound.length) {
            for (let i = 0; i < meanFound.length; i++) {
                for (
                    let j = 0;
                    j < meaning[meanFound[i]].listAnswers.length;
                    j++
                ) {
                    answers.push(
                        choice(answers[meaning[meanFound[i]].answers[j]])
                    );
                }
            }
            await Salty.message(msg, answers.join(", "));
        } else {
            const random: string[] = answers["rand"];
            await Salty.message(msg, choice(random));
        }
    },
});
