import { CommandDescriptor } from "../../typings";
import { clean } from "../../utils/generic";

const PING_MESSAGES = [
  "Nearly perfect!",
  "That's pretty good",
  "That's ok, I guess",
  "That's a bit laggy",
  "That's quite laggy",
  "Ok that's laggy as fuck",
  "WTF that's super laggy",
  "Jesus Christ how can you manage with that much lag?",
  "Dear god are you on a safari in the middle of the ocean?",
  "Get off of this world you fucking chinese",
];

const command: CommandDescriptor = {
  name: "test",
  aliases: ["latency", "ping"],
  help: [
    {
      argument: null,
      effect: "Tests Salty's functionnalities",
    },
  ],

  async action({ args, msg, send }) {
    const option = clean(args.shift() || "");
    const text = args.join(" ");
    switch (option) {
      case "error": {
        throw new Error(text || "test error");
      }
      case "success": {
        return send.success(text || "test success");
      }
      case "warn": {
        return send.warn(text || "test warn");
      }
      case "info": {
        return send.info(text || "test info");
      }
      case "string":
      case "message": {
        return send.message(text || "test message");
      }
    }

    const sentMsg = await send.message("Testing latency...");
    const latency = sentMsg.createdTimestamp - msg.createdTimestamp;

    sentMsg.delete().catch();
    await send.info(
      `Pong! Latency is ${latency}. ${
        PING_MESSAGES[Math.floor(latency / 200)] || "lol wat"
      }`
    );
  },
};

export default command;
