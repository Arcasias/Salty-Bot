import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { isAdmin } from "../../utils";

Command.register({
    name: "admin",
    aliases: ["administrator"],
    category: "general",
    channel: "guild",
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
    async action({ msg, target }) {
        const isRequestedUserAdmin: boolean = isAdmin(target.user, msg.guild!);

        // Fuck if/else structures, long live ternary operators
        Salty.message(
            msg,
            target.isMention
                ? // mention
                  target.user.id === Salty.bot.user!.id
                    ? // mention is Salty
                      isRequestedUserAdmin
                        ? // mention is Salty and is admin
                          "of course I'm an admin ;)"
                        : // mention is Salty and not admin
                          "nope, I'm not an admin on this server :c"
                    : // mention is not Salty
                    isRequestedUserAdmin
                    ? // mention is not Salty and is admin
                      "<mention> is a wise and powerful admin"
                    : // mention is not Salty and is not admin
                      "<mention> is not an admin"
                : // author
                isRequestedUserAdmin
                ? // author is admin
                  "you have been granted the administrators permissions. May your deeds be blessed forever!"
                : // author is not admin
                  "nope, you're not an admin"
        );
    },
});