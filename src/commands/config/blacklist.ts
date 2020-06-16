import Command from "../../classes/Command";
import User from "../../classes/User";
import salty from "../../salty";
import { isDev, meaning } from "../../utils";

Command.register({
    name: "blacklist",
    aliases: ["bl"],
    category: "config",
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
    access: "dev",

    async action({ msg, args, target }) {
        const user = User.get(target.user.id)!;
        switch (meaning(args[0])) {
            case "add":
            case "set": {
                if (!target.isMention) {
                    return salty.warn(msg, "You need to mention someone.");
                }
                if (target.user.id === salty.bot.user!.id) {
                    return salty.warn(
                        msg,
                        "Woa woa woa! You can't just put me in my own blacklist you punk!"
                    );
                }
                if (isDev(target.user)) {
                    return salty.warn(
                        msg,
                        "Can't add a Salty dev to the blacklist: they're too nice for that!"
                    );
                }
                await User.update(user.id, { black_listed: true });
                return salty.success(msg, `<mention> added to the blacklist`);
            }
            case "remove": {
                if (!target.isMention) {
                    return salty.warn(msg, "You need to mention someone.");
                }
                if (target.user.id === salty.bot.user!.id) {
                    return salty.info(
                        msg,
                        "Well... as you might expect, I'm not in the blacklist."
                    );
                }
                if (!user.black_listed) {
                    return salty.info(
                        msg,
                        `**${target.name}** is not in the blacklist.`
                    );
                }
                await User.update(user.id, { black_listed: false });
                return salty.success(
                    msg,
                    `<mention> removed from the blacklist`
                );
            }
            default: {
                if (target.isMention && target.user.id === salty.bot.user!.id) {
                    return salty.info(
                        msg,
                        "Nope, I am not and will never be in the blacklist"
                    );
                }
                if (target.isMention) {
                    return salty.info(
                        msg,
                        user?.black_listed
                            ? "<mention> is black-listed"
                            : "<mention> isn't black-listed... yet"
                    );
                }
                const blackListedUsers = User.filter(
                    (u: User) => u.black_listed
                ).map(
                    (u: User) =>
                        salty.bot.users!.cache.get(u.discord_id)?.username
                );
                if (blackListedUsers.length) {
                    return salty.embed(msg, {
                        title: "Blacklist",
                        description: blackListedUsers.join("\n"),
                    });
                }
                return salty.info(
                    msg,
                    "The black list is empty. You can help by *expanding it*."
                );
            }
        }
    },
});
