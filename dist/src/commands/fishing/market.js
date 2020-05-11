import Command from "../../classes/Command.js";
import { IncorrectValue, MissingArg, OutOfRange, SaltyException, } from "../../classes/Exception.js";
import Salty from "../../classes/Salty.js";
import User from "../../classes/User.js";
import { choice } from "../../utils.js";
const repurchase = 0.5;
export default new Command({
    name: "market",
    keys: ["shop", "trade"],
    help: [
        {
            argument: null,
            effect: "Displays market wares",
        },
        {
            argument: "buy ***market item number***",
            effect: "Buys the indicated item from the market",
        },
        {
            argument: "sell ***inventory item number***",
            effect: "Sells the indicated item from your inventory",
        },
        {
            argument: "info",
            effect: "Get more help for market browsing",
        },
    ],
    visibility: "public",
    async action(msg, args) {
        const angler = User.get(msg.author.id);
        const { gold, inventory } = angler;
        if (args[0] && Salty.getList("buy").includes(args[0])) {
            let itemIds = Object.keys(items).filter((itemId) => items[itemId].price);
            let marketItems = itemIds.map((id) => Object.assign(items[id], { id }));
            let options = {
                title: "sea market",
                color: 0xffffff,
                inline: true,
                fields: [],
            };
            if (!args[1]) {
                throw new MissingArg("what you want to buy");
            }
            if (isNaN(args[1])) {
                throw new IncorrectValue("item number", "number");
            }
            if (!marketItems[parseInt(args[1] - 1)]) {
                throw new OutOfRange(parseInt(args[1]));
            }
            let item = marketItems[parseInt(args[1] - 1)];
            if (gold < item.price) {
                return Salty.error(msg, "you don't have enough money for that item");
            }
            if (inventory.includes(marketItems[args[1]].id)) {
                throw new SaltyException("you already have one of these. Why buy another ?");
            }
            angler.inventory.push(marketItems[args[1]].id);
            angler.inventory.sort((a, b) => a - b);
            angler.gold -= item.price;
            options.title = "transaction successful";
            options.description = `**${msg.member.displayName}** successfully bought **${item.name}** for ${item.price} gold`;
            options.footer = choice(Salty.getList("transactionSuccess"));
            Salty.embed(msg, options);
        }
        else if (args[0] && Salty.getList("sell").includes(args[0])) {
            let { inventory } = angler;
            if (!args[1]) {
                throw new MissingArg("what you want to sell");
            }
            if (isNaN(args[1])) {
                throw new IncorrectValue("item number", "number");
            }
            let itemIndex = parseInt(args[1] - 1);
            if (!marketItems[itemIndex]) {
                throw new OutOfRange(parseInt(args[1]));
            }
            let item = items[inventory[itemIndex]];
            if (!item.price) {
                return Salty.error(msg, "you can't sell that");
            }
            angler.inventory.splice(itemIndex, 1);
            angler.gold += item.price * repurchase;
            Salty.embed(msg, {
                title: "transaction successful",
                description: `**${msg.member.displayName}** successfully sold **${item.name}** for ${item.price * repurchase} gold`,
                color: 0xffffff,
                inline: true,
                fields: [],
                footer: choice(Salty.getList("transactionSuccess")),
            });
        }
        else {
            let itemIds = Object.keys(items).filter((itemId) => items[itemId].price);
            let marketItems = itemIds.map((id) => Object.assign(items[id], { id }));
            if (args[0]) {
                if (!marketItems[parseInt(args[0]) - 1]) {
                    throw new OutOfRange(parseInt(args[0]));
                }
                let item = marketItems[parseInt(args[0]) - 1];
                Salty.embed(msg, {
                    title: item.name,
                    description: item.description,
                    color: Salty.config.quality[item.quality].color,
                    footer: `Price: ${item.price}`,
                });
            }
            else {
                let fields = [];
                marketItems.forEach((marketItem, i) => {
                    fields.push({
                        title: `${i + 1}) ${marketItem.name}`,
                        description: `Cost: ${marketItem.price}`,
                    });
                });
                Salty.embed(msg, {
                    title: "sea market",
                    description: "welcome, customer ! Have a look on my beautiful wares !",
                    color: 0xffffff,
                    inline: true,
                    fields,
                    footer: `your current amount of gold: ${angler.gold}`,
                });
            }
        }
    },
});