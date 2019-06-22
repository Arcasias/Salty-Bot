'use strict';

const Command = require('../../classes/Command');
const imgur = require('imgur');
const S = require('../../classes/Salty');
const error = require('../../classes/Exception');
imgur.setClientId();
imgur.setAPIUrl('https://api.imgur.com/3/');

module.exports = new Command({
    name: 'image',
    keys: [
        "image",
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
    action: function (msg, args) {

        if (! args[0]) throw new error.MissingArg("image name");

    	imgur.search(args.join("AND"), {
    		sort: 'top', 
    		dateRange: 'all',
    		page: 1 }).then(json => {

    			if (json.data.length < 1) throw new error.Error();

    			const { title, link, images } = UTIL.choice(json.data);

    			let image = images ? images[0].link : link;

    			S.embed(msg, { title, url: link, image });

    	}).catch(S.embed.bind(S, msg, { title: "no result", type: 'error' }));
    },
});

