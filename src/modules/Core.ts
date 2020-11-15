import { GuildChannel, Message } from "discord.js";
import Command from "../classes/Command";
import Crew from "../classes/Crew";
import Event from "../classes/Event";
import Module from "../classes/Module";
import Sailor from "../classes/Sailor";
import Salty from "../classes/Salty";
import { prefix } from "../config";
import salty from "../salty";
import { intro, keywords } from "../terms";
import {
  Dictionnary,
  FieldsDescriptor,
  MessageActor,
  Runnable,
} from "../types";
import {
  choice,
  clean,
  error,
  escapeRegex,
  log,
  logRequest,
  search,
  title,
} from "../utils";

class CoreModule extends Module {
  // Public handlers

  public async onChannelDelete({
    payload: [channel],
  }: Event<"channelDelete">): Promise<any> {
    if (channel instanceof GuildChannel) {
      await Crew.update(
        { default_channel: channel.id },
        { default_channel: null }
      );
    }
  }

  public async onError({ payload: err }: Event<"error">): Promise<any> {
    error(err);
    salty.restart();
  }

  public async onGuildCreate({
    payload: [guild],
  }: Event<"guildCreate">): Promise<any> {
    Crew.create({ discord_id: guild.id });
  }

  public async onGuildDelete({
    payload: [guild],
  }: Event<"guildDelete">): Promise<any> {
    if (guild.member(salty.user)) {
      await Crew.remove({ discord_id: guild.id });
    }
  }

  public async onGuildMemberAdd({
    payload: [member],
  }: Event<"guildMemberAdd">): Promise<any> {
    const guild = await Crew.get(member.guild.id);
    if (guild?.default_channel) {
      const channel = salty.getTextChannel(guild.default_channel);
      channel.send(`Hey there ${member.user}! Have a great time here (͡° ͜ʖ ͡°)`);
    }
    if (guild?.default_role) {
      member.roles.add(guild.default_role);
    }
  }

  public async onGuildMemberRemove({
    payload: [member],
  }: Event<"guildMemberRemove">): Promise<any> {
    const guild = await Crew.get(member.guild.id);
    if (guild?.default_channel) {
      const channel = salty.getTextChannel(guild.default_channel);
      const name = member.user?.username || "unknown";
      channel.send(`Well, looks like ${name} got bored of us :c`);
    }
  }

  public async onReady(): Promise<any> {
    salty.user.setStatus("online");
    // Fetch all guilds
    const activeGuilds: string[] = salty.bot.guilds.cache.map(
      (guild) => guild.id
    );
    const guilds: Crew[] = await Crew.search();
    const toRemove: number[] = guilds
      .filter((g) => !activeGuilds.includes(g.discord_id))
      .map((g) => g.id);
    const toCreate: FieldsDescriptor[] = activeGuilds
      .filter((id) => !guilds.some((g) => g.discord_id === id))
      .map((id) => ({ discord_id: id }));
    if (toCreate.length) {
      await Crew.create(...toCreate);
    }
    if (toRemove.length) {
      // No need to wait for this one
      Crew.remove(toRemove);
    }
    for (const guild of guilds) {
      if (guild.default_channel) {
        const channel = salty.getTextChannel(guild.default_channel);
        channel.send(title(choice(intro)));
      }
    }
    const loadingTime: number =
      Math.floor((Date.now() - salty.startTime.getTime()) / 100) / 10;

    log(
      `${Command.list.size} commands loaded. ${Command.aliases.size} keys in total.`
    );
    log(
      `Salty loaded in ${loadingTime} second${
        loadingTime === 1 ? "" : "s"
      } and ready to salt the chat :D`
    );
  }

  public async onMessage(event: Event<"message">): Promise<any> {
    const {
      payload: [msg],
    } = event;
    const { author, cleanContent, guild } = msg;

    // Look for an interaction
    let interaction: boolean = !guild;
    const interactRegex = this.getInteractionRegex(
      salty.user.username,
      guild?.members.cache.get(salty.user.id)?.nickname
    );
    const content = cleanContent
      .replace(interactRegex, () => {
        interaction = true;
        return "";
      })
      .trim();

    // Event is stopped if an interaction is found.
    if (interaction) {
      event.stop();
    } else {
      return;
    }

    // Logs the  action
    logRequest(guild?.name || "DM", author.username, cleanContent);

    // Fetches the actors of the action
    const { source, targets } = await this.getMessageActors(msg, salty);
    if (source.sailor.black_listed) {
      // The action is discarded if the user is black-listed
      return;
    }
    if (!content.length) {
      // Simple interaction if the messsage is empty
      return salty.message(msg, "Yes?");
    }

    // Handles the actual command if found
    const msgArgs = content.split(" ").filter((word) => Boolean(word.trim()));
    const actionName = msgArgs.shift() || "";
    const commandName = Command.aliases.get(clean(actionName));
    let command: Runnable;
    let commandArgs = msgArgs;
    if (commandName) {
      if (msgArgs.length && keywords.help.includes(clean(msgArgs[0]))) {
        commandArgs = [commandName];
        command = Command.list.get("help")!;
      } else {
        command = Command.list.get(commandName)!;
      }
    } else {
      // If no command found, tries to find the closest matches
      const closests = search([...Command.aliases.keys()], actionName, 2);
      if (closests.length) {
        const cmds: Dictionnary<string> = {};
        for (const key of closests) {
          const cmdName = Command.aliases.get(key)!;
          if (!(cmdName in cmds)) {
            cmds[cmdName] = key;
          }
        }
        return salty.message(
          msg,
          `command "*${actionName}*" doesn't exist. Did you mean "*${Object.values(
            cmds
          ).join(`*" or "*`)}*"?`
        );
      }
      commandArgs.unshift(actionName);
      command = Command.list.get("talk")!;
    }
    // If no command nor close match, the "talk" command is called instead
    command.run(msg, commandArgs, source, targets);
  }

  // Private

  /**
   * @param nickname
   */
  private getInteractionRegex(
    username: string,
    nickname?: string | null
  ): RegExp {
    const terms = [
      `^(${escapeRegex(prefix)})`,
      `(@?.?${escapeRegex(username)})`,
    ];
    if (nickname) {
      terms.push(`(@?.?${escapeRegex(nickname)})`);
    }
    return new RegExp(terms.join("|"));
  }

  /**
   * @param msg
   */
  private async getMessageActors(
    { author, member, mentions }: Message,
    salty: Salty
  ): Promise<{
    source: MessageActor;
    targets: MessageActor[];
  }> {
    const userSailors: Map<string, Sailor | null> = new Map();
    const idsToFetch: string[] = [];
    for (const user of [author, ...mentions.users.values()]) {
      if (user.id === salty.bot.user?.id) {
        userSailors.set(user.id, salty.sailor);
      } else {
        userSailors.set(user.id, null);
        idsToFetch.push(user.id);
      }
    }

    // Get existing sailors
    const existingSailors: Sailor[] = await Sailor.search({
      discord_id: idsToFetch,
    });
    for (const sailor of existingSailors) {
      userSailors.set(sailor.discord_id, sailor);
    }

    // Fill with new sailors if needed
    const idsToCreate: { discord_id: string }[] = [...userSailors]
      .filter(([id, sailor]) => !sailor)
      .map(([id]) => ({ discord_id: id }));
    if (idsToCreate.length) {
      const newSailors: Sailor[] = await Sailor.create(...idsToCreate);
      for (const sailor of newSailors) {
        userSailors.set(sailor.discord_id, sailor);
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
}

salty.registerModule(CoreModule, 0);
