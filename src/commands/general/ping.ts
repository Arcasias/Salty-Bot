import salty from "../../salty";
import { CommandDescriptor } from "../../typings";
import { percent, title } from "../../utils";

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

const command: CommandDescriptor = {
  name: "ping",
  aliases: ["latency", "test"],
  help: [
    {
      argument: null,
      effect: "Tests client-server latency",
    },
  ],

  async action({ msg, send }) {
    // If too much salt, skips the latency test
    if (percent(3)) {
      return send.info("Pong, and I don't give a fuck about your latency");
    }
    // Sends another message and displays the difference between the first and the second
    const sentMsg = await send.message("Pinging...");
    if (!sentMsg) {
      return;
    }
    const latency = sentMsg.createdTimestamp - msg.createdTimestamp;
    const message = PING_MESSAGES[Math.floor(latency / 100)] || "lol wat";

    salty.deleteMessage(sentMsg);
    await send.info(`Pong! Latency is ${latency}. ${title(message)}`);
  },
};

export default command;
