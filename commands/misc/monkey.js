import Command from '../../classes/Command.js';
import * as error from '../../classes/Exception.js';

export default new Command({
    name: 'monkey',
    keys: [
        "bogosort",
        "monkeysort",
        "permutationsort",
        "shotgunsort",
        "slowsort",
        "stupidsort",
    ],
    help: [
        {
            argument: null,
            effect: "Monkey sorts a 10 elements array"
        },
        {
            argument: "***array length***",
            effect: "Monkey sorts an array of the provided length (lowered to maximum 10, let's not make me explode shall we ?)"
        },
    ],
    visibility: 'public',
    async action(msg, args) {
        if (!args[0]) {
            throw new error.MissingArg("length");
        }
        if (args[0] < 1) {
            throw new error.IncorrectValue("length", "number between 1 and 10");
        }

        const runningMsg = await this.msg(msg, "monkey sorting ...");
        let tests = 0;
        let length = Math.min(args[0], 10);
        let list = [];

        const sortingTime = await new Promise((resolve, reject) => {
            for (let i = 0; i < length; i ++) {
                list.push(i);
            }
            list = UTIL.shuffle(list);
            tests = 0;

            const startTimeStamp = Date.now();

            while (! UTIL.isSorted(list)) {
                list = UTIL.shuffle(list);
                tests ++;
            }
            resolve(Math.floor((Date.now() - startTimeStamp) / 100) / 10);
        });

        runningMsg.delete();
        await this.embed(msg, { title: `monkey sort on a **${ length }** elements list took **${ sortingTime }** seconds in **${ tests }** tests`, type: 'success', react: '🐒' });
    },
});

