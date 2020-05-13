import Command, { CommandParams } from "../../classes/Command";
import { MissingArg } from "../../classes/Exception";

class TtsCommand extends Command {
    public name = "tts";
    public keys = ["speak"];
    public help = [
        {
            argument: null,
            effect: null,
        },
        {
            argument: "***something to say***",
            effect: "Says something out loud",
        },
    ];

    async action({ args, msg }: CommandParams) {
        // Just sends the arguments as a TTS message
        if (!args[0]) {
            throw new MissingArg("message");
        }
        msg.delete();
        await msg.channel.send(args.join(" "), { tts: true });
    }
}

export default TtsCommand;
