"use strict";

const Command = require("../../classes/Command.js");
const Salty = require("../../classes/Salty.js");

const MESSAGES = [
    "nearly perfect !",
    "that's pretty good",
    "that's ok, i guess",
    "that's a bit laggy",
    "that's quite laggy",
    "ok that's laggy as fuck",
    "WTF that's super laggy",
    "Jesus Christ how can you manage with that much lag ?",
    "dear god are you on a safari in the middle of the ocean ?",
    "get off of this world you fucking chinese",
];

module.exports = new Command({
    name: "ping",
    keys: ["latency", "test"],
    help: [
        {
            argument: null,
            effect: "Tests client-server latency",
        },
    ],
    visibility: "public",
    async action(msg) {
        // If too much salt, skips the latency test
        if (UTIL.generate(3)) {
            await Salty.error(
                msg,
                "pong, and I don't give a fuck about your latency"
            );
        } else {
            // Sends another message and displays the difference between the first and the second
            const sentMsg = await msg.channel.send("Pinging...");
            const latency = sentMsg.createdTimestamp - msg.createdTimestamp;
            const message = MESSAGES[Math.floor(latency / 100)] || "lol wat";

            await sentMsg.delete();
            await Salty.success(
                msg,
                `pong ! Latency is ${latency}. ${UTIL.title(message)}`
            );
        }
    },
});
