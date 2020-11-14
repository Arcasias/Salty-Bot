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
    Runnable
} from "../types";
import {
    choice,
    clean,



    error,
    escapeRegex,
    log,
    logRequest,
    search,
    title
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
            channel.send(
                `Hey there ${member.user}! Have a great time here (͡° ͜ʖ ͡°)`
            );
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
        const { source, target } = await this.getMessageActors(msg, salty);
        if (source.sailor.black_listed) {
            // The action is discarded if the user is black-listed
            return;
        }
        if (!content.length) {
            // Simple interaction if the messsage is empty
            return salty.message(msg, "Yes?");
        }

        // Handles the actual command if found
        const msgArgs = content
            .split(" ")
            .filter((word) => Boolean(word.trim()));
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
        command.run(msg, commandArgs, source, target);
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
        target: MessageActor | null;
    }> {
        const mention = mentions.users.first();
        const toFetch = [author.id];
        if (mention && !mention.bot) {
            toFetch.push(mention.id);
        }
        let [sourceSailor, targetSailor]: Sailor[] = await Sailor.search({
            discord_id: toFetch,
        });
        const toCreate = [];
        if (!sourceSailor) {
            toCreate.push({ discord_id: author.id });
        } else if (mention && !targetSailor) {
            if (mention.id === author.id) {
                targetSailor = sourceSailor;
            } else if (mention.id === salty.bot.user?.id) {
                targetSailor = salty.sailor;
            } else if (!mention.bot) {
                toCreate.push({ discord_id: mention.id });
            }
        }
        if (toCreate.length) {
            const created: Sailor[] = await Sailor.create(...toCreate);
            if (created.length && !sourceSailor) {
                sourceSailor = created.shift()!;
            }
            if (created.length && !targetSailor) {
                targetSailor = created.shift()!;
            }
        }

        const source: MessageActor = {
            user: author,
            member,
            sailor: sourceSailor,
            name: member?.displayName || author.username,
        };
        let target: MessageActor | null = null;
        if (targetSailor) {
            const mem = mentions.members?.first() || null;
            // Generates the target actor object if a mention exists
            target = {
                user: mention!,
                member: mem,
                sailor: targetSailor,
                name: mem?.displayName || mention!.username,
            };
        }
        return { source, target };
    }
}

salty.registerModule(CoreModule, 0);
