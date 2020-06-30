import Command from "../../classes/Command";
import Sailor from "../../classes/Sailor";
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
        switch (meaning(args[0])) {
            case "add":
            case "set": {
                if (!target) {
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
                await Sailor.update(target.sailor.id, { black_listed: true });
                return salty.success(msg, `<mention> added to the blacklist`);
            }
            case "remove": {
                if (!target) {
                    return salty.warn(msg, "You need to mention someone.");
                }
                if (target.user.id === salty.bot.user!.id) {
                    return salty.info(
                        msg,
                        "Well... as you might expect, I'm not in the blacklist."
                    );
                }
                if (!target.sailor.black_listed) {
                    return salty.info(
                        msg,
                        `**${target.name}** is not in the blacklist.`
                    );
                }
                await Sailor.update(target.sailor.id, { black_listed: false });
                return salty.success(
                    msg,
                    `<mention> removed from the blacklist`
                );
            }
            default: {
                if (target && target.user.id === salty.bot.user!.id) {
                    return salty.info(
                        msg,
                        "Nope, I am not and will never be in the blacklist"
                    );
                }
                if (target) {
                    return salty.info(
                        msg,
                        target.sailor?.black_listed
                            ? "<mention> is black-listed"
                            : "<mention> isn't black-listed... yet"
                    );
                }
                const blackListedSailors: Sailor[] = await Sailor.search({
                    black_listed: true,
                });
                const blackListedNames: string[] = blackListedSailors
                    .map(
                        (s: Sailor) =>
                            msg.guild?.members.cache.get(s.discord_id)
                                ?.displayName
                    )
                    .filter(<(x: any) => x is string>((u) => Boolean(u)));
                if (blackListedNames.length) {
                    return salty.embed(msg, {
                        title: "Blacklist",
                        description: blackListedNames.join("\n"),
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
