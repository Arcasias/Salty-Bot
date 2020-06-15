import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import User from "../../classes/User";
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
                    return Salty.warn(msg, "You need to mention someone.");
                }
                if (target.user.id === Salty.bot.user!.id) {
                    return Salty.message(
                        msg,
                        "Woa woa woa! You can't just put me in my own blacklist you punk!"
                    );
                }
                if (isDev(target.user)) {
                    return Salty.message(
                        msg,
                        "Can't add a Salty dev to the blacklist: they're too nice for that!"
                    );
                }
                await User.update(user.id, { black_listed: true });
                return Salty.success(msg, `<mention> added to the blacklist`);
            }
            case "remove": {
                if (!target.isMention) {
                    return Salty.warn(msg, "You need to mention someone.");
                }
                if (target.user.id === Salty.bot.user!.id) {
                    return Salty.message(
                        msg,
                        "Well... as you might expect, I'm not in the blacklist."
                    );
                }
                if (!user.black_listed) {
                    return Salty.warn(
                        msg,
                        `**${target.name}** is not in the blacklist.`
                    );
                }
                await User.update(user.id, { black_listed: false });
                return Salty.success(
                    msg,
                    `<mention> removed from the blacklist`
                );
            }
            default: {
                if (target.isMention && target.user.id === Salty.bot.user!.id) {
                    return Salty.message(
                        msg,
                        "Nope, I am not and will never be in the blacklist"
                    );
                }
                if (target.isMention) {
                    return Salty.message(
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
                        Salty.bot.users!.cache.get(u.discord_id)?.username
                );
                if (blackListedUsers.length) {
                    return Salty.embed(msg, {
                        title: "Blacklist",
                        description: blackListedUsers.join("\n"),
                    });
                }
                return Salty.message(
                    msg,
                    "The black list is empty. You can help by *expanding it*."
                );
            }
        }
    },
});
