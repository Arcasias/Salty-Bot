import Command from "../../classes/Command";
import { MissingArg } from "../../classes/Exception";

export default new Command({
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
    visibility: "public",
    async action({ msg, args }) {
        // Just sends the arguments as a TTS message
        if (!args[0]) {
            throw new MissingArg("message");
        }
        msg.delete();
        await msg.channel.send(args.join(" "), { tts: true });
    },
});
