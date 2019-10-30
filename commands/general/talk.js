import Command from '../../classes/Command.js';
import * as Salty from '../../classes/Salty.js';
import { getList } from '../../classes/Salty.js';

const meanList = getList('meaning');

export default new Command({
    name: 'talk',
    keys: [],
    help: [
        {
            argument: null,
            effect: null
        },
        {
            argument: "***anything***",
            effect: "I'll answer to what you said. As I'm not a really advanced AI, you may want to try simple things such as \"Hello\" or \"How are you\""
        },
    ],
    visibility: 'public',
    async action(msg, args) {
        let cleanedMsg = " " + args.map(arg => UTIL.clean(arg)).join(" ") + " ";
        let meanFound = [];
        let answers = [];

        for (let mean in meanList) {
            for (let i = 0; i < meanList[mean].list.length; i ++) {
                if (! meanFound.includes(mean) && cleanedMsg.match(new RegExp(" " + meanList[mean].list[i] + " ", 'g'))) {
                    meanFound.push(mean);
                }
            }
        }
        if (0 < meanFound.length) {
            for (let i = 0; i < meanFound.length; i ++) {
                for (let j = 0; j < meanList[meanFound[i]].answers.length; j ++) {
                    answers.push(UTIL.choice(getList('answers')[meanList[meanFound[i]].answers[j]]));
                }
            }
            await Salty.message(msg, answers.join(", "));
        } else {
            await Salty.message(msg, UTIL.choice(getList('answers')['rand']));
        }
    },
});

