'use strict';

const Command = require('../../classes/Command');
const S = require('../../classes/Salty');

module.exports = new Command({
    name: 'ping',
    keys: [
        "ping",
        "latency",
        "test",
    ],
    help: [
        {
            argument: null,
            effect: "Tests client-server latency"
        },
    ],
    visibility: 'public', 
    action: async function (msg, args) {
        // If too much salt, skips the latency test
        if (UTIL.generate(3)) {
            await S.embed(msg, { title: "pong, and I don't give a fuck about your latency", type: 'error' });
        } else {
            // Sends another message and displays the difference between the first and the second
            const sentMsg = await msg.channel.send("Pinging...");
            let latency = sentMsg.createdTimestamp - msg.createdTimestamp;
            let m = "";

            if (latency < 0) m = "lol wat";
            else if (latency < 100) m = "nearly perfect !";
            else if (latency < 200) m = "that's pretty good";
            else if (latency < 300) m = "that's ok, i guess";
            else if (latency < 400) m = "that's a bit laggy";
            else if (latency < 500) m = "that's quite laggy";
            else if (latency < 600) m = "ok that's laggy as fuck";
            else if (latency < 700) m = "WTF that's super laggy";
            else if (latency < 800) m = "Jesus Christ how can you manage with that much lag ?";
            else if (latency < 900) m = "dear god are you on a safari in the middle of the ocean ?";
            else m = "get off this world you fucking chinese";

            sentMsg.delete();

            await S.embed(msg, { title: `pong ! Latency is ${ latency }, ${ m }`, type: 'success' });
        }
    },
});

