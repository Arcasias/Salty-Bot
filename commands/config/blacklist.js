import Command from '../../classes/Command.js';
import User from '../../classes/User.js';
import * as error from '../../classes/Exception.js';

export default new Command({
    name: 'blacklist',
    keys: [
        "blackls",
        "bl",
    ],
    help: [
        {
            argument: null,
            effect: "Tells you wether you're an admin"
        },
        {
            argument: "***mention***",
            effect: "Tells you wether the ***mention*** is an admin"
        },
    ],
    visibility: 'dev',
    async action(msg, args) {
        const mention = msg.mentions.members.first();
        const user = mention ? User.get(mention.user.id) : null;

        if (args[0] && this.getList('add').includes(args[0])) {
            if (! mention) {
                throw new error.MissingMention();
            }
            if (mention.id === this.bot.user.id) {
                return this.msg(msg, "Woa woa woa ! You can't just put me in my own blacklist you punk !");
            }
            await User.update(user.id, { black_listed: true });
            await this.embed(msg, { title: `<mention> added to the blacklist`, type: 'success' });

        } else if (args[0] && this.getList('delete').includes(args[0])) {
            if (! mention) {
                throw new error.MissingMention();
            }
            if (mention.id === this.bot.user.id) {
                return this.msg(msg, "Well... as you might expect, I'm not in the blacklist.");
            }
            if (!user.black_listed) {
                throw new error.SaltyException(`**${mention.nickname}** is not in the blacklist`);
            }
            await User.update(user.id, { black_listed: false });
            await this.embed(msg, { title: `<mention> removed from the blacklist`, type: 'success' });

        } else {
            if (mention) {
                if (mention.id === this.bot.user.id) {
                    await this.msg(msg, "Nope, I am not and will never be in the blacklist");
                } else {
                    await this.msg(msg, user.black_listed ? "<mention> is black-listed" : "<mention> isn't black-listed... yet");
                }
            } else {
                const blackListedUsers = User.filter(u => u.black_listed).map(u => this.bot.users.get(u.discord_id).username);
                if (blackListedUsers.length) {
                    await this.embed(msg, { title: "Blacklist", description: blackListedUsers.join("\n") });
                } else {
                    await this.msg(msg, "The black list is empty. You can help by *expanding it*.");
                }
            }
        }
    },
});

