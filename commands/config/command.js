import Command from '../../classes/Command.js';
import QuickCommand from '../../classes/QuickCommand.js';
import * as error from '../../classes/Exception.js';

export default new Command({
    name: 'command',
    keys: [
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
    async action(msg, args) {
        if (args[0] && this.getList('delete').includes(args[0])) {
            const commandName = args[1];
            if (!commandName) {
                throw new error.MissingArg("command");
            }
            const command = QuickCommand.find(cmd => cmd.keys.includes(commandName));
            if (!command) {
                throw new error.SaltyException("NonExistingObject", "That command doesn't exist");
            }
            this.unsetQuickCommand(command);
            await QuickCommand.remove(command.id);

            this.embed(msg, { title: `Command "**${command.name}**" deleted`, type: 'success' });
        } else if (args[0]) {
            const allArgs = args.join(" ").split("\`\`\`");

            if (!allArgs[1]) {
                throw new error.MissingArg("effect");
            }
            let keys = allArgs.shift().split(",").filter(word => word.trim() !== "");
            const name = keys[0];
            const effect = allArgs.shift().trim();

            if (! keys[0]) {
                throw new error.MissingArg("keys");
            }

            for (let key = 0; key < keys.length; key ++) {
                keys[key] = keys[key].trim().toLowerCase();

                if (this.commands.keys[keys[key]]) {
                    throw new error.SaltyException("ExistingObject", "That command already exists");
                }
            }

            const commands = await QuickCommand.create({ name, keys: keys.join(), effect });
            this.setQuickCommand(commands[0]);

            await this.embed(msg, { title: `Command "**${name}**" created`, type: 'success' });
        } else {
            if (QuickCommand.size == 0) {
                throw new error.EmptyObject("commands");
            }
            await this.embed(msg, {
                title: "List of commands",
                description: QuickCommand.map((cmd, i) => `${i + 1}) ${cmd.name}`).join('\n')
            });
        }
    },
});

