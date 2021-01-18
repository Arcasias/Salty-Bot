import { Message, Snowflake, TextChannel } from "discord.js";
import salty from "../salty";
import { isSnowflake } from "./generic";

export async function getTargetMessage(
  args: string[],
  channelId: Snowflake
): Promise<Message | null> {
  let messageId: Snowflake | null = null;

  if (isSnowflake(args[0])) {
    messageId = args.shift()!;
  }
  if (isSnowflake(args[0])) {
    channelId = messageId!;
    messageId = args.shift()!;
  }

  let channel: TextChannel;
  try {
    channel = salty.getTextChannel(channelId);
  } catch (err) {
    return null;
  }

  if (messageId) {
    return channel.messages.fetch(messageId);
  }
  return null;
}
