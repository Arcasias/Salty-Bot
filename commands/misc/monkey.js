'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');
const error = require('../../classes/Exception');

module.exports = new Command({
    name: 'monkey',
    keys: [
        "monkey",
        "monkeysort",
        "bogosort",
        "permutationsort",
        "stupidsort",
        "slowsort",
        "shotgunsort",
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
    action: function (msg, args) {

        if (! args[0]) throw new error.MissingArg("length");

        if (args[0] < 1) throw new error.IncorrectValue("length", "number between 1 and 10");

        S.msg(msg, "monkey sorting ...").then(message => {

            let runningMsg = message;
            let tests = 0;
            let length = Math.min(args[0], 10);
            let list = [];

            new Promise((resolve, reject) => {
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
            }).then(sortingTime => {
                runningMsg.delete();
                S.embed(msg, { title: `monkey sort on a **${ length }** elements list took **${ sortingTime }** seconds in **${ tests }** tests`, type: 'success', react: '🐒' });
            });
        });
    },
});

