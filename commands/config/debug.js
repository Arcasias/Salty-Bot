'use strict';

const Command = require('../../classes/Command');
const Guild = require('../../classes/Guild');
const S = require('../../classes/Salty');
const error = require('../../classes/Exception');
const User = require('../../classes/User');

const MAXDEPTH = 3;

module.exports = new Command({
    name: 'debug',
    keys: [
        "debug",
    ],
    help: [
        {
            argument: "***JS code***",
            effect: "Executes a ***JS code*** within Salty context",
        },
    ],
    visibility: 'dev', 
    action: async function (msg, args) {
        if (! args[0]) throw new error.MissingArg("instructions");

        let res = eval(args.join(" "));
        let message = `${args.join(" ")} = /*${typeof res}*/ ${getFormat(res, 0)}`;

        S.msg(msg, `\`\`\`js\n${message.slice(0, 1950)}\n\`\`\``);
        LOG.log(message);
    },
});

function getFormat(variable, depth) {
    if (depth > MAXDEPTH) {
        return;
    }
    let type = Array.isArray(variable) ? 'array' : typeof variable;
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
