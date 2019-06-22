'use strict';

const Command = require('../../classes/Command');
const items = require('../../data/items.json');
const S = require('../../classes/Salty');
const error = require('../../classes/Exception');
const User = require('../../classes/User');

module.exports = new Command({
    name: 'rod',
    keys: [
        "rod",
        "rods",
    ],
    help: [
        {
            argument: null,
            effect: "Shows all of your owned rods"
        },
        {
            argument: "***rod number***",
            effect: "Equips the indicated rod"
        },
    ],
    visibility: 'public', 
    action: function (msg, args) {
        let angler = User.get(msg.author.id);
        let equippedRod = items[angler.equipped.rod];
        let rodsToString = '';
        let rods = {};

        angler.inventory.forEach((id, i) => { 
            rods[id] = items[id];
            rodsToString += `${ i + 1 }) ${ items[id].name }\n`;
        });
        if (args[0]) {
            if (["buy", "sell", "trade"].includes(args[0])) {
                return S.embed(msg, { title: "wanna trade ?", description: "if you want to trade items, just go to the \`$market\`" });
            }
            if (! (0 < args[0] && args[0] <= angler.inventory.length)) {
                throw new error.OutOfRange(args[0]);
            }
            angler.equipped.rod = angler.inventory[args[0] - 1];

            S.embed(msg, { title: `you just equipped **${ items[angler.equipped.rod].name }**`, type: 'success' });
        
        } else {
            let options = {
                title: `${ msg.member.displayName } is currently equipped with ${ equippedRod.name }`,
                color: S.config.quality[equippedRod.quality].color,
                description: equippedRod.description,
                fields: [{ title: "List of rods", description: rodsToString }]
            };
            S.embed(msg, options);
        } 
    },
});

