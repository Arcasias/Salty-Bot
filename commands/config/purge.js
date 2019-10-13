'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');
const error = require('../../classes/Exception');

module.exports = new Command({
    name: 'purge',
    keys: [
        "purge",
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
            effect: "Recursively deletes every message one by one. This feature is still experimental and might cause issues. Use carefully"
        },
    ],
    visibility: 'admin', 
    action: async function (msg, args) {
        if (args[0] && S.getList('bot').includes(args[0])) {
            const messages = await msg.channel.fetchMessages();
            let messagesToDelete = messages.filter(message => message.author.bot);
            try {
                await msg.channel.bulkDelete(messagesToDelete);
                await S.embed(msg, { title: "most recent bot messages have been deleted", type: 'success' });
            } catch (err) {
                LOG.error(err);
            }
        } else if (args[0] && 'endless' === args[0]) {
            const purge = async channel => {
                const messages = await channel.fetchMessages({ limit: 1 });
                await messages[0].delete();
                await purge(channel);
            }
            return purge(msg.channel);

        } else {
            if (args[0] && args[0] != parseInt(args[0])) {
                throw new error.IncorrectValue("length", "number");
            }
            if (parseInt(args[0]) === 0) {
                throw new error.SaltyException("you must delete at least 1 message");
            }

            let toDelete = Math.min(parseInt(args[0]) + 1, 100) || 100;

            try {
                await msg.channel.bulkDelete(toDelete, true);
                await S.embed(msg, { title: `${ toDelete } messages have been successfully deleted`, type: 'success' });
            } catch (err) {
                LOG.error(err);
            }
        }
    },
});

