'use strict';

const Command = require('../../classes/Command.js');
const error = require('../../classes/Exception.js');
const Salty = require('../../classes/Salty.js');

let purging = false;

async function purgeEndless(channel) {
    const messages = await channel.fetchMessages({ limit: 1 });
    if (!purging) {
        return;
    }
    await messages.first().delete();
    return purgeEndless(channel);
}

module.exports = new Command({
    name: 'purge',
    keys: [
        "prune",
    ],
    help: [
        {
            argument: null,
            effect: "Deletes the last 100 messages"
        },
        {
            argument: "***amount***",
            effect: "Deletes the last ***amount*** messages"
        },
        {
            argument: "bot",
            effect: "Deletes the last 100 messages sent by a bot"
        },
        {
            argument: "endless",
            effect: "Recursively deletes every message one by one in the current channel. Use carefully."
        },
        {
            argument: "clear",
            effect: "Used to stop the endless purge"
        },
    ],
    visibility: 'dev',
    async action(msg, args) {
        switch (this.meaning(args[0])) {
            case 'bot':
                const messages = await msg.channel.fetchMessages();
                let messagesToDelete = messages.filter(message => message.author.bot);
                try {
                    await msg.channel.bulkDelete(messagesToDelete);
                    await Salty.success(msg, "most recent bot messages have been deleted");
                } catch (err) {
                    LOG.error(err);
                }
                break;
            case 'clear':
                if (purging) {
                    purging = false;
                    Salty.success(msg, "purge stopped");
                } else {
                    Salty.error(msg, "i wasn't purging anything");
                }
                break;
            case 'string':
                if (args[0] === 'endless') {
                    purging = true;
                    return purgeEndless(msg.channel);
                }
                /* falls through */
            default:
                if (isNaN(args[0])) {
                    throw new error.IncorrectValue("length", "number");
                }
                if (parseInt(args[0]) === 0) {
                    throw new error.SaltyException("you must delete at least 1 message");
                }
                const toDelete = Math.min(parseInt(args[0]), 100) || 100;
                try {
                    await msg.channel.bulkDelete(toDelete, true);
                    await Salty.success(msg, `${toDelete} messages have been successfully deleted`);
                } catch (err) {
                    LOG.error(err);
                }
        }
    },
});
