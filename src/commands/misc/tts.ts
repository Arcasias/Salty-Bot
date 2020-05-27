import Command from "../../classes/Command";
import Salty from "../../classes/Salty";

Command.register({
    name: "tts",
    keys: ["speak"],
    help: [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***something to say***",
            effect: "Says something out loud",
        },
    ],

    async action({ args, msg }) {
        // Just sends the arguments as a TTS message
        if (!args[0]) {
            return Salty.warn(msg, "You need to tell me what to say.");
        }
        msg.delete();
        await msg.channel.send(args.join(" "), { tts: true });
    },
});
