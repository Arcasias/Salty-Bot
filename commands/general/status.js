'use strict';

const Command = require('../../classes/Command');
const Guild = require('../../classes/Guild');
const packageInfo = require('../../package.json');
const S = require('../../classes/Salty');
const User = require('../../classes/User');

module.exports = new Command({
    name: 'status',
    keys: [
        "status",
        "state",
        "server",
        "local",
        "instance",
        "git",
    ],
    help: [
        {
            argument: null,
            effect: "Gets you some information about me"
        },
    ],
    visibility: 'dev', 
    action: async function (msg, args) {
        const options = {
            title: `Salty Bot`,
            url: packageInfo.homepage,
            description: `Last started on ${S.startTime.toString().split(' GMT')[0]}`,
            fields: [
                { title: `Hosted on`, description: process.env.MODE === 'server' ? 'Server' : 'Local instance' },
                { title: `Owner`, description: S.config.owner.username },
                { title: `Servers`, description: `Running on ${Guild.size} servers` },
                { title: `Users`, description: `Handling ${User.size} users` },
                { title: `Developers`, description: `${S.config.devs.length} contributors` },
                { title: `Blacklist`, description: `${User.filter(u => u.black_listed).length} troublemakers` },
            ],
            inline: true,
        };
        if (process.env.DEBUG === 'true') {
            options.footer = `Debug mode active`;
        }
        await S.embed(msg, options);
    },
});

