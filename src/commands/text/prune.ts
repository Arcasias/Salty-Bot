import { Collection, DMChannel, Message } from "discord.js";
import salty from "../../salty";
import { CommandDescriptor, MessageAction } from "../../typings";
import { meaning } from "../../utils/generic";

async function removeMessages(
  msg: Message,
  rawLength: string | undefined,
  filter?: (msg: Message) => boolean
): Promise<any> {
  const { channel } = msg;
  let limit = 100;
  if (typeof rawLength === "string") {
    const length = Number(rawLength);
    if (isNaN(length)) {
      return salty.warn(msg, "Given length must be a valid number.");
    }
    if (length < 1) {
      return salty.warn(msg, "You must delete at least 1 message.");
    }
    limit = Math.min(length, 100);
  }

  const actions: Collection<string, MessageAction> = new Collection();
  // Confirm deleting
  actions.set("✅", {
    onAdd: async (user) => {
      if (msg.author.id !== user.id) {
        return;
      }
      await msg.delete().catch();
      const messages = await channel.messages.fetch({ limit: 100 });
      const filtered = filter ? messages.filter(filter) : messages;
      const toDelete = [...filtered.values()].slice(0, limit);
      if (channel instanceof DMChannel) {
        await Promise.allSettled(toDelete.map((m) => m.delete()));
      } else {
        await channel.bulkDelete(toDelete, true);
      }
    },
  });
  // Cancel deletion
  actions.set("❌", {
    onAdd: async (user) => {
      if (msg.author.id === user.id) {
        msg.delete().catch();
      }
    },
  });

  return salty.addActions(msg, { actions }, msg.author.id);
}

const command: CommandDescriptor = {
  name: "prune",
  aliases: ["purge"],
  help: [
    {
      argument: null,
      effect: "Deletes the last 100 messages",
    },
    {
      argument: "`amount`",
      effect: "Deletes the last `amount` messages",
    },
    {
      argument: "bot",
      effect: "Deletes the last 100 messages sent by a bot",
    },
  ],
  access: "admin",
  async action({ args, msg, targets }) {
    switch (meaning(args[0])) {
      case "bot": {
        const filter = ({ author }: Message): boolean => author.bot;
        return removeMessages(msg, args[1], filter);
      }
      default: {
        let filter;
        if (targets.length) {
          const { user } = targets[0];
          filter = ({ author }: Message) => author.equals(user);
        }
        return removeMessages(msg, args[0], filter);
      }
    }
  },
};

export default command;
