import { GuildMember } from "discord.js";
import Command from "../../classes/Command";
import { MissingMention, SaltyException } from "../../classes/Exception";
import Salty from "../../classes/Salty";
import User from "../../classes/User";

export default new Command({
    name: "blacklist",
    keys: ["blackls", "bl"],
    help: [
        {
            argument: null,
            effect: "Tells you wether you're an admin",
        },
        {
            argument: "***mention***",
            effect: "Tells you wether the ***mention*** is an admin",
        },
    ],
    visibility: "dev",
    async action(msg, args) {
        const mention: GuildMember = msg.mentions.members.first();
        const user: User = User.get(mention.user.id);

        switch (this.meaning(args[0])) {
            case "add":
                if (!mention) {
                    throw new MissingMention();
                }
                if (mention.id === Salty.bot.user.id) {
                    return Salty.message(
                        msg,
                        "Woa woa woa ! You can't just put me in my own blacklist you punk !"
                    );
                }
                await User.update(user.id, { black_listed: true });
                await Salty.success(msg, `<mention> added to the blacklist`);
                break;
            case "delete":
                if (!mention) {
                    throw new MissingMention();
                }
                if (mention.id === Salty.bot.user.id) {
                    return Salty.message(
                        msg,
                        "Well... as you might expect, I'm not in the blacklist."
                    );
                }
                if (!user.black_listed) {
                    throw new SaltyException(
                        `**${mention.nickname}** is not in the blacklist`
                    );
                }
                await User.update(user.id, { black_listed: false });
                await Salty.success(
                    msg,
                    `<mention> removed from the blacklist`
                );
                break;
            default:
                if (mention) {
                    if (mention.id === Salty.bot.user.id) {
                        await Salty.message(
                            msg,
                            "Nope, I am not and will never be in the blacklist"
                        );
                    } else {
                        await Salty.message(
                            msg,
                            user.black_listed
                                ? "<mention> is black-listed"
                                : "<mention> isn't black-listed... yet"
                        );
                    }
                } else {
                    const blackListedUsers = User.filter(
                        (u: User) => u.black_listed
                    ).map(
                        (u: User) =>
                            Salty.bot.users.cache.get(u.discord_id).username
                    );
                    if (blackListedUsers.length) {
                        await Salty.embed(msg, {
                            title: "Blacklist",
                            description: blackListedUsers.join("\n"),
                        });
                    } else {
                        await Salty.message(
                            msg,
                            "The black list is empty. You can help by *expanding it*."
                        );
                    }
                }
        }
    },
});