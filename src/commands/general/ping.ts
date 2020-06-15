import Command from "../../classes/Command";
import Salty from "../../classes/Salty";
import { generate, pingable, title } from "../../utils";

const PING_MESSAGES = [
    "nearly perfect!",
    "that's pretty good",
    "that's ok, i guess",
    "that's a bit laggy",
    "that's quite laggy",
    "ok that's laggy as fuck",
    "WTF that's super laggy",
    "Jesus Christ how can you manage with that much lag?",
    "dear god are you on a safari in the middle of the ocean?",
    "get off of this world you fucking chinese",
];

Command.register({
    name: "ping",
    aliases: ["latency", "test"],
    category: "general",
    help: [
        {
            argument: null,
            effect: "Tests client-server latency",
        },
    ],

    async action({ args, msg }) {
        if (args.length && args[0] === "role") {
            const roles = msg.guild?.roles.cache;
            if (roles) {
                const roleIds = roles
                    .filter((role) => Boolean(role.color))
                    .map((role) => pingable(role.id));
                return Salty.message(msg, roleIds.join(" "));
            } else {
                return Salty.warn(msg, "No roles on this server.");
            }
        } else {
            // If too much salt, skips the latency test
            if (generate(3)) {
                return Salty.success(
                    msg,
                    "pong, and I don't give a fuck about your latency"
                );
            }
            // Sends another message and displays the difference between the first and the second
            const sentMsg = await msg.channel.send("Pinging...");
            const latency = sentMsg.createdTimestamp - msg.createdTimestamp;
            const message =
                PING_MESSAGES[Math.floor(latency / 100)] || "lol wat";

            await sentMsg.delete();
            await Salty.success(
                msg,
                `pong! Latency is ${latency}. ${title(message)}`
            );
        }
    },
});
