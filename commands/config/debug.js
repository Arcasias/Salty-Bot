'use strict';

const Command = require('../../classes/Command.js');
const error = require('../../classes/Exception.js');
const Guild = require('../../classes/Guild.js'); // Added to the scope
const Salty = require('../../classes/Salty.js');
const User = require('../../classes/User.js'); // Added to the scope

const MAXDEPTH = 3;

function getFormat(variable, depth) {
    if (depth > MAXDEPTH) {
        return;
    }
    const type = Array.isArray(variable) ? 'array' : typeof variable;
    let res, items;
    switch (type) {
        case 'string':
            res = `"${variable}"`;
            break;
        case 'array':
            items = [];
            for (let item of variable) {
                items.push(getFormat(item, depth + 1));
            }
            res = `[${items.join(', ')}]`;
            break;
        case 'object':
            items = [];
            for (let key in variable) {
                items.push(`${getFormat(key, depth + 1)}: ${getFormat(variable[key], depth + 1)}`);
            }
            res = `{\n${items.join(',\n\t')}\n}`;
            break;
        default:
            res = variable;
            break;
    }
    return res;
}

module.exports = new Command({
    name: 'debug',
    keys: [],
    help: [
        {
            argument: "***JS code***",
            effect: "Executes a ***JS code*** within Salty context",
        },
    ],
    visibility: 'dev',
    async action(msg, args) {
        if (! args[0]) {
            throw new error.MissingArg("instructions");
        }

        const res = eval(args.join(" "));
        const message = `${args.join(" ")} = /*${typeof res}*/ ${getFormat(res, 0)}`;

        Salty.message(msg, `\`\`\`js\n${message.slice(0, 1950)}\n\`\`\``);
        LOG.log(message);
    },
});
