'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');
const error = require('../../classes/Exception');

module.exports = new Command({
    name: 'choose',
    keys: [
        "choose",
        "choice",
        "chose",
        "shoes",
    ],
    help: [
        {
            argument: null,
            effect: null
        },
        {
            argument: "***first choice*** / ***second choice*** / ...",
            effect: "Chooses randomly from all provided choices. They must be separated with \"/\". Please don't use this to decide important life choices, it's purely random ok ?"
        },
    ],
    visibility: 'public', 
    action: function (msg, args) {

        if (! args[0] || ! args[1]) {
            throw new error.MissingArg("choices");
        }
        let options = args.join(" ").split('/');

        S.msg(msg, `I choose ${UTIL.choice(options)}`);
    },
});

