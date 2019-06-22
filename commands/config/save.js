'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');

module.exports = new Command({
    name: 'save',
    keys: [
        "save",
    ],
    help: [
        {
            argument: null,
            effect: "Saves the current state of volatile data"
        },
    ],
    visibility: 'dev', 
    action: function (msg, args) {

        S.updateFiles().then(() => {
            S.embed(msg, { title: "volatile data successfully saved", react: "💾", type: 'success' });
        });
    },
});

