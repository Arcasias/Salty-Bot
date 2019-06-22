'use strict';

const Command = require('../../classes/Command');
const Data = require('../../classes/Data');
const S = require('../../classes/Salty');
const error = require('../../classes/Exception');

module.exports = new Command({
    name: 'command',
    keys: [
        "command",
        "cmd",
    ],
    help: [
        {
            argument: null,
            effect: null
        },
        {
            argument: "***command key 1***, ***command key 2***, ...  \\\`\\\`\\\`***command block***\\\`\\\`\\\`",
            effect: "Creates a new command having ***command keys*** as its triggers. ***command effect*** will then be displayed as a response"
        },
    ],
    visibility: 'dev', 
    action: async function (msg, args) {
        let commands;
        await Data.read('commands').then(cmds => {
            commands = cmds;
        });

        if (args[0] && S.getList('delete').includes(args[0])) {
            const commandName = args[1];

            if (! commandName) throw new error.MissingArg("command");

            const command = commands.find(cmd => cmd.keys.includes(commandName));

            if (! command) throw new error.SaltyException("that command doesn't exist");

            commands.splice(commands.indexOf(command), 1);
            Data.write('commands', commands);

            S.embed(msg, { title: `Command "**${command.name}**" deleted`, type: 'success' });
        } else if (args[0]) {
            const { author } = msg;

            let allArgs = args.join(" ").split("\`\`\`");

            if (! allArgs[1]) {
                throw new error.MissingArg("effect");
            }
            let keys = allArgs.shift().split(",").filter(word => word.trim() != "");
            const name = keys[0];
            const effect = allArgs.shift().trim();

            if (! keys[0]) {
                throw new error.MissingArg("keys");;
            }
            
            for (let key = 0; key < keys.length; key ++) {
                keys[key] = keys[key].trim().toLowerCase();

                if (S.commands.keys[keys[key]]) {
                    throw new error.SaltyException("that command already exists");
                }
            }
            const command = { name, keys, effect };
            commands.push(command);
            S.setCommand(command);
            S.embed(msg, { title: `Command "**${name}**" created`, type: 'success' });
        } else {
            if (commands.length == 0) {
                throw new error.EmptyObject("commands");
            }
            S.embed(msg, {
                title: "List of commands",
                description: commands.map((cmd, i) => `${i + 1}) ${cmd.name}`).join('\n')
            });
        }
    },
});

