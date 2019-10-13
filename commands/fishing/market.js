'use strict';

const Command = require('../../classes/Command');
const items = require('../../data/items.json');
const S = require('../../classes/Salty');
const error = require('../../classes/Exception');
const User = require('../../classes/User');

const repurchase = 0.5;

module.exports = new Command({
    name: 'market',
    keys: [
        "market",
        "shop",
        "trade",
    ],
    help: [
        {
            argument: null,
            effect: "Displays market wares"
        },
        {
            argument: "buy ***market item number***",
            effect: "Buys the indicated item from the market"
        },
        {
            argument: "sell ***inventory item number***",
            effect: "Sells the indicated item from your inventory"
        },
        {
            argument: "info",
            effect: "Get more help for market browsing"
        },
    ],
    visibility: 'public', 
    action: async function (msg, args) {
        const angler = User.get(msg.author.id);
        const { gold, inventory } = angler;

        if (args[0] && S.getList('buy').includes(args[0])) {
            let itemIds = Object.keys(items).filter(itemId => items[itemId].price)
            let marketItems = itemIds.map(id => Object.assign(items[id], { id }));
            let options = {
                title: "sea market",
                color: 0xFFFFFF,
                inline: true,
                fields: [],
            };

            if (! args[1]) {
                throw new error.MissingArg("what you want to buy");
            }
            if (isNaN(args[1])) {
                throw new error.IncorrectValue("item number", "number");
            }
            if (! marketItems[parseInt(args[1] - 1)]) {
                throw new error.OutOfRange(parseInt(args[1]));
            }
            let item = marketItems[parseInt(args[1] - 1)];

            if (gold < item.price) {
                return S.embed(msg, { title: "you don't have enough money for that item", type: 'error' });
            }
            if (inventory.includes(marketItems[args[1]].id)) {
                throw new error.SaltyException("you already have one of these. Why buy another ?");
            }
            angler.inventory.push(marketItems[args[1]].id);
            angler.inventory.sort((a, b) => a - b);
            angler.gold -= item.price;

            options.title = "transaction successful";
            options.description = `**${ msg.member.displayName }** successfully bought **${ item.name }** for ${ item.price } gold`;
            options.footer = UTIL.choice(S.getList('transactionSuccess'));

            S.embed(msg, options);
            
        } else if (args[0] && S.getList('sell').includes(args[0])) {
            let { inventory } = angler;

            if (! args[1]) {
                throw new error.MissingArg("what you want to sell");
            }
            if (isNaN(args[1])) {
                throw new error.IncorrectValue("item number", "number");
            }
            let itemIndex = parseInt(args[1] - 1);

            if (! marketItems[itemIndex]) {
                throw new error.OutOfRange(parseInt(args[1]));
            }
            let item = items[inventory[itemIndex]];

            if (! item.price) {
                return S.embed(msg, { title: "you can't sell that", type: 'error' });
            }
            angler.inventory.splice(itemIndex, 1);
            angler.gold += item.price * repurchase;

            S.embed(msg, {
                title: "transaction successful",
                description: `**${ msg.member.displayName }** successfully sold **${ item.name }** for ${ item.price * repurchase } gold`,
                color: 0xFFFFFF,
                inline: true,
                fields: [],
                footer: UTIL.choice(S.getList('transactionSuccess')),
            });
        } else {
            let itemIds = Object.keys(items).filter(itemId => items[itemId].price)
            let marketItems = itemIds.map(id => Object.assign(items[id], { id }));

            if (args[0]) {
                if (! marketItems[parseInt(args[0]) - 1]) {
                    throw new error.OutOfRange(parseInt(args[0]));
                }
                let item = marketItems[parseInt(args[0]) - 1];
                
                S.embed(msg, {
                    title: item.name,
                    description: item.description,
                    color: S.config.quality[item.quality].color,
                    footer: `Price: ${ item.price }`,
                });

            } else {
                let fields = [];

                marketItems.forEach((marketItem, i) => {
                    fields.push({ title: `${ i + 1 }) ${ marketItem.name }`, description: `Cost: ${ marketItem.price }` });
                });
                S.embed(msg, {
                    title: "sea market",
                    description: "welcome, customer ! Have a look on my beautiful wares !",
                    color: 0xFFFFFF,
                    inline: true,
                    fields,
                    footer: `your current amount of gold: ${ angler.gold }`,
                });
            }
        }
    },
});

