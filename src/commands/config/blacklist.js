"use strict";

const Command = require("../../classes/Command.js");
const error = require("../../classes/Exception.js");
const Salty = require("../../classes/Salty.js");
const User = require("../../classes/User.js");

module.exports = new Command({
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
        const mention = msg.mentions.members.first();
        const user = mention ? User.get(mention.user.id) : null;

        switch (this.meaning(args[0])) {
            case "add":
                if (!mention) {
                    throw new error.MissingMention();
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
                    throw new error.MissingMention();
                }
                if (mention.id === Salty.bot.user.id) {
                    return Salty.message(
                        msg,
                        "Well... as you might expect, I'm not in the blacklist."
                    );
                }
                if (!user.black_listed) {
                    throw new error.SaltyException(
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
                        (u) => u.black_listed
                    ).map((u) => Salty.bot.users.get(u.discord_id).username);
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
