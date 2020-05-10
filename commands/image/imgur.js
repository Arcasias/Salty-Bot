'use strict';

const Command = require('../../classes/Command.js');
const error = require('../../classes/Exception.js');
const imgur = require('imgur');
const Salty = require('../../classes/Salty.js');

imgur.setClientId();
imgur.setAPIUrl('https://api.imgur.com/3/');

module.exports = new Command({
    name: 'imgur',
    keys: [
        "img",
        "imgur",
    ],
    help: [
        {
            argument: null,
            effect: "Work in progress"
        },
    ],
    visibility: 'public',
    async action(msg, args) {

        if (!args[0]) {
            throw new error.MissingArg("image name");
        }

        try {
            const json = await imgur.search(args.join("AND"), {
                sort: 'top',
                dateRange: 'all',
                page: 1
            });
            if (json.data.length < 1) {
                throw new error.SaltyException('no result');
            }
            const { title, link, images } = UTIL.choice(json.data);
            const image = images ? images[0].link : link;
            Salty.embed(msg, { title, url: link, image });
        } catch (err) {
            Salty.error(msg, "no result");
        }
    },
});
