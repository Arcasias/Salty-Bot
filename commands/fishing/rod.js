import Command from '../../classes/Command.js';
import * as error from '../../classes/Exception.js';
import User from '../../classes/User.js';

export default new Command({
    name: 'rod',
    keys: [
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
    async action(msg, args) {
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
                return this.embed(msg, { title: "wanna trade ?", description: "if you want to trade items, just go to the \`$market\`" });
            }
            if (! (0 < args[0] && args[0] <= angler.inventory.length)) {
                throw new error.OutOfRange(args[0]);
            }
            angler.equipped.rod = angler.inventory[args[0] - 1];

            await this.embed(msg, { title: `you just equipped **${ items[angler.equipped.rod].name }**`, type: 'success' });

        } else {
            let options = {
                title: `${ msg.member.displayName } is currently equipped with ${ equippedRod.name }`,
                color: this.config.quality[equippedRod.quality].color,
                description: equippedRod.description,
                fields: [{ title: "List of rods", description: rodsToString }]
            };
            await this.embed(msg, options);
        }
    },
});

