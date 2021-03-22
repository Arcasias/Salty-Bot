import { Collection, Message } from "discord.js";
import Command from "../classes/Command";
import Sailor from "../classes/Sailor";
import SaltyModule from "../classes/SaltyModule";
import { config } from "../database/config";
import { help, keywords } from "../strings";
import { MessageAction, MessageActor } from "../typings";
import { choice, clean, search } from "../utils/generic";
import { logRequest } from "../utils/log";

export default class CoreModule extends SaltyModule {
  public callbacks = [{ method: "message", callback: this.onMessage }];

  /**
   * @param msg
   */
  private async getMessageActors({
    author,
    member,
    mentions,
  }: Message): Promise<{
    source: MessageActor;
    targets: MessageActor[];
  }> {
    const userSailors: Map<string, Sailor | null> = new Map();
    const idsToFetch: string[] = [];
    for (const user of [author, ...mentions.users.values()]) {
      if (user.id === this.salty.bot.user?.id) {
        userSailors.set(user.id, this.salty.sailor);
      } else if (!user.bot) {
        userSailors.set(user.id, null);
        idsToFetch.push(user.id);
      }
    }

    // Get existing sailors
    const existingSailors: Sailor[] = await Sailor.search({
      discordId: idsToFetch,
    });
    for (const sailor of existingSailors) {
      userSailors.set(sailor.discordId, sailor);
    }

    // Fill with new sailors if needed
    const idsToCreate: { discordId: string }[] = [...userSailors]
      .filter(([id, sailor]) => !sailor)
      .map(([id]) => ({ discordId: id }));
    if (idsToCreate.length) {
      const newSailors: Sailor[] = await Sailor.create(...idsToCreate);
      for (const sailor of newSailors) {
        userSailors.set(sailor.discordId, sailor);
      }
    }

    const source: MessageActor = {
      user: author,
      member,
      sailor: userSailors.get(author.id)!,
      name: member?.displayName || author.username,
    };
    const targets: MessageActor[] = mentions.users.map((user, id) => {
      const member = mentions.members?.get(id) || null;
      return {
        user,
        member,
        sailor: userSailors.get(id)!,
        name: member?.displayName || user.username,
      };
    });

    return { source, targets };
  }

  private async onMessage(msg: Message) {
    const { attachments, author, cleanContent, guild } = msg;

    // Looks for an interaction: DM, prefix or mention
    const prefixInteraction: boolean = cleanContent.startsWith(config.prefix);
    const mentionInteraction: boolean = msg.mentions.users.has(
      this.salty.user.id
    );

    if (guild && !mentionInteraction && !prefixInteraction) return;

    // All mentions are removed
    let content = msg.content.replace(/<@!\d+>/g, "");
    if (prefixInteraction) {
      // Prefix is removed
      content = content.slice(config.prefix.length);
    }

    // Fetches the actors of the action
    const { source, targets } = await this.getMessageActors(msg);

    // Logs the  action
    logRequest(guild, source, cleanContent);

    // The action is discarded if the user is black-listed
    if (source.sailor.blackListed) return;

    // Handles the actual command if found
    const msgArgs = content
      .split(/\s+/)
      .map((w) => w.trim())
      .filter(Boolean);

    if (!msgArgs.length && !attachments.size) {
      // Simple interaction if the messsage is empty
      return this.salty.message(msg, choice(help), { reply: msg });
    }

    const rawCommandName = clean(msgArgs.shift() || "");
    const commandName = Command.aliases.get(rawCommandName);
    const commandContext = Command.createContext(
      this.salty,
      msg,
      rawCommandName,
      source,
      targets,
      msgArgs
    );
    if (commandName) {
      if (msgArgs.length && keywords.help.includes(clean(msgArgs[0]))) {
        return commandContext.run("help", [rawCommandName]);
      } else {
        return commandContext.run(commandName, msgArgs);
      }
    }
    // If no command found, tries to find the closest matches
    const [closest] = search([...Command.aliases.keys()], rawCommandName, 2);
    if (!closest) {
      return this.salty.message(msg, choice(help), { reply: msg });
    }
    const closestCommand = Command.aliases.get(closest)!;
    const helpMessage = await this.salty.message(
      msg,
      `command "*${rawCommandName}*" doesn't exist. Did you mean "*${closestCommand}*"?`
    );
    const actions = new Collection<string, MessageAction>();
    actions.set("✅", {
      onAdd: (user) => {
        if (author.id === user.id) {
          helpMessage.delete().catch();
          commandContext.run(closestCommand, msgArgs);
        }
      },
    });
    actions.set("❌", {
      onAdd: (user) => {
        if (author.id === user.id) {
          helpMessage.delete().catch();
        }
      },
    });
    return this.salty.addActions(helpMessage, { actions }, author.id);
  }
}
