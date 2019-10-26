import Command from '../../classes/Command.js';
import Guild from '../../classes/Guild.js';
import packageJson from '../../package.json';
import User from '../../classes/User.js';

export default new Command({
    name: 'state',
    keys: [
        "git",
        "instance",
        "local",
        "server",
    ],
    help: [
        {
            argument: null,
            effect: "Gets you some information about me"
        },
    ],
    visibility: 'dev',
    async action(msg, args) {
        const options = {
            title: `Salty Bot`,
            url: packageJson.homepage,
            description: `Last started on ${this.startTime.toString().split(' GMT')[0]}`,
            fields: [
                { title: `Hosted on`, description: process.env.MODE === 'server' ? 'Server' : 'Local instance' },
                { title: `Owner`, description: this.config.owner.username },
                { title: `Servers`, description: `Running on ${Guild.size} servers` },
                { title: `Users`, description: `Handling ${User.size} users` },
                { title: `Developers`, description: `${this.config.devs.length} contributors` },
                { title: `Blacklist`, description: `${User.filter(u => u.black_listed).length} troublemakers` },
            ],
            inline: true,
        };
        if (process.env.DEBUG === 'true') {
            options.footer = `Debug mode active`;
        }
        await this.embed(msg, options);
    },
});