import Command, { CommandVisiblity } from "../../classes/Command";
import { MissingMention, SaltyException } from "../../classes/Exception";
import Salty from "../../classes/Salty";
import User from "../../classes/User";

class BlackListCommand extends Command {
    public name = "blacklist";
    public keys = ["bl"];
    public help = [
        {
            argument: null,
            effect: "Tells you wether you're an admin",
        },
        {
            argument: "***mention***",
            effect: "Tells you wether the ***mention*** is an admin",
        },
    ];
    public visibility = <CommandVisiblity>"dev";

    async action({ msg, args, target }) {
        const user: User = User.get(target.user.id);
        switch (this.meaning(args[0])) {
            case "add":
                if (!target.isMention) {
                    throw new MissingMention();
                }
                if (target.user.id === Salty.bot.user.id) {
                    return Salty.message(
                        msg,
                        "Woa woa woa! You can't just put me in my own blacklist you punk!"
                    );
                }
                if (Salty.isDev(target.user)) {
                    return Salty.message(
                        msg,
                        "Can't add a Salty dev to the blacklist: they're too nice for that!"
                    );
                }
                await User.update(user.id, { black_listed: true });
                await Salty.success(msg, `<mention> added to the blacklist`);
                break;
            case "remove":
                if (!target.isMention) {
                    throw new MissingMention();
                }
                if (target.user.id === Salty.bot.user.id) {
                    return Salty.message(
                        msg,
                        "Well... as you might expect, I'm not in the blacklist."
                    );
                }
                if (!user.black_listed) {
                    throw new SaltyException(
                        `**${target.member.nickname}** is not in the blacklist`
                    );
                }
                await User.update(user.id, { black_listed: false });
                await Salty.success(
                    msg,
                    `<mention> removed from the blacklist`
                );
                break;
            default:
                if (target.isMention) {
                    if (target.user.id === Salty.bot.user.id) {
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
    }
}

export default BlackListCommand;
