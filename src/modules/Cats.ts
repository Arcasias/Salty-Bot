import axios from "axios";
import Command from "../classes/Command";
import Event from "../classes/Event";
import Module from "../classes/Module";
import salty from "../salty";
import { meaning } from "../utils";

const CHANNEL_PREFIX: string = "🐱";
const CAT_API_URL: string = "https://api.thecatapi.com/v1/images/search";

Command.register({
    name: "catify",
    aliases: ["cats"],
    category: "misc",
    access: "admin",
    help: [
        {
            argument: "***set***",
            effect: "Sets the current channel as a cat channel",
        },
        {
            argument: "***unset***",
            effect: "Unsets the current channel as a cat channel",
        },
    ],
    async action({ args, msg }) {
        const channel = salty.getTextChannel(msg.channel.id);
        const isCatified = channel.name.startsWith(CHANNEL_PREFIX);
        const reason = `cat channel toggled by ${msg.author.username}`;
        switch (meaning(args[0])) {
            case "add":
            case "set": {
                if (isCatified) {
                    return salty.warn(msg, "This is already a cat channel!");
                }
                await channel.edit(
                    { name: [CHANNEL_PREFIX, channel.name].join(" ") },
                    reason
                );
                return salty.success(msg, "Channel set as a cat channel", {
                    react: CHANNEL_PREFIX,
                });
            }
            case "remove": {
                if (!isCatified) {
                    return salty.warn(
                        msg,
                        "This channel is not a cat channel!"
                    );
                }
                await channel.edit(
                    { name: channel.name.slice(CHANNEL_PREFIX.length) },
                    reason
                );
                return salty.success(msg, "Channel unset as a cat channel", {
                    react: CHANNEL_PREFIX,
                });
            }
            default: {
                await salty.message(
                    msg,
                    `This channel is${isCatified ? "" : " not"}catified`
                );
            }
        }
    },
});

export default class CatsModule extends Module {
    public async onMessage(event: Event<"message">): Promise<any> {
        const {
            payload: [msg],
        } = event;
        const channel = salty.getTextChannel(msg.channel.id);

        // Only applies to "marked" channels
        if (!channel.name.startsWith(CHANNEL_PREFIX)) {
            return;
        }

        event.stop();

        try {
            msg.delete();
        } catch (err) {}

        const {
            data: [firstResult],
        } = await axios.get(CAT_API_URL);
        await salty.message(msg, firstResult.url, {
            format: false,
            title: false,
        });
    }
}
