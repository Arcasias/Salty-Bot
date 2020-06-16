import Command from "../../classes/Command";
import salty from "../../salty";
import { isSorted, shuffle } from "../../utils";

Command.register({
    name: "monkey",
    aliases: [
        "bogosort",
        "monkeysort",
        "permutationsort",
        "shotgunsort",
        "slowsort",
        "stupidsort",
    ],
    category: "misc",
    help: [
        {
            argument: null,
            effect: "Monkey sorts a 10 elements array",
        },
        {
            argument: "***array length***",
            effect:
                "Monkey sorts an array of the provided length (lowered to maximum 10, let's not make me explode shall we?)",
        },
    ],

    async action({ args, msg }) {
        if (!args[0]) {
            return salty.warn(msg, "Missing the length of the array.");
        }
        if (Number(args[0]) < 1) {
            return salty.warn(
                msg,
                "Array length must be a number between 1 and 10."
            );
        }

        const runningMsg = await salty.message(msg, "monkey sorting ...");
        let tests = 0;
        let length = Math.min(Number(args[0]), 10);
        let list: number[] = [];

        const sortingTime = await new Promise((resolve) => {
            for (let i = 0; i < length; i++) {
                list.push(i);
            }
            list = shuffle(list);
            tests = 0;

            const startTimeStamp = Date.now();

            while (!isSorted(list)) {
                list = shuffle(list);
                tests++;
            }
            resolve(Math.floor((Date.now() - startTimeStamp) / 100) / 10);
        });

        runningMsg.delete();
        await salty.info(
            msg,
            `monkey sort on a **${length}** elements list took **${sortingTime}** seconds in **${tests}** tests`,
            { react: "🐒" }
        );
    },
});
