import Command from "../../classes/Command";
import salty from "../../salty";

Command.register({
    name: "tts",
    aliases: ["speak"],
    category: "text",
    help: [
        {
            argument: "***something to say***",
            effect: "Says something out loud",
        },
    ],

    async action({ args, msg }) {
        // Just sends the arguments as a TTS message
        if (!args[0]) {
            return salty.warn(msg, "You need to tell me what to say.");
        }
        msg.delete();
        await msg.channel.send(args.join(" "), { tts: true });
    },
});
