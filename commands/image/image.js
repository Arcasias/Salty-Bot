import Command from '../../classes/Command.js';
import imgur from 'imgur';
import * as error from '../../classes/Exception.js';

imgur.setClientId();
imgur.setAPIUrl('https://api.imgur.com/3/');

export default new Command({
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
            this.embed(msg, { title, url: link, image });
        } catch (err) {
            this.embed(msg, { title: "no result", type: 'error' });
        }
    },
});

