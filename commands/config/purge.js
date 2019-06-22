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
    action: function (msg, args) {
        if (args[0] && S.getList('bot').includes(args[0])) {
            msg.channel.fetchMessages().then(messages => {
                let messagesToDelete = messages.filter(message => message.author.bot);

                msg.channel.bulkDelete(messagesToDelete)
                    .then(S.embed(msg, { title: "most recent bot messages have been deleted", type: 'success' }))
                    .catch(LOG.error);
            });
        } else if (args[0] && 'endless' == args[0]) {
            const purge = channel => {
                channel.fetchMessages({ limit: 1 }).then(messages => { messages.forEach(message => { message.delete().then(() => { purge(channel) }) }) });
            }
            return purge(msg.channel);

        } else {
            if (args[0] && args[0] != parseInt(args[0])) throw new error.IncorrectValue("length", "number");

            if (0 == args[0]) throw new error.SaltyException("you must delete at least 1 message");

            let toDelete = Math.min(parseInt(args[0]) + 1, 100) || 100;

            msg.channel.bulkDelete(toDelete, true)
                .then(S.embed(msg, { title: `${ toDelete } messages have been successfully deleted`, type: 'success' }))
                .catch(LOG.error);
        }
    },
});

