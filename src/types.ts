import {
    Collection,
    GuildMember,
    Message,
    MessageEmbedOptions,
    MessageReaction,
    PresenceStatusData,
    Snowflake,
    User,
} from "discord.js";
import { Item } from "warframe-items";

export interface ActionParameters {
    readonly args: string[];
    readonly msg: Message;
    readonly target: MessageTarget;
}
export interface CommandCategoryDoc {
    description: string;
    icon: string;
    name: string;
}
export interface CommandCategoryInfo extends CommandCategoryDoc {
    commands: string[];
}
export interface CommandDescriptor {
    readonly action: CommandAction;
    readonly category: AvailableCategories;
    readonly name: string;
    readonly help?: CommandHelpSection[];
    readonly aliases?: string[];
    readonly access?: CommandAccess;
    readonly channel?: CommandChannel;
}
export interface CommandHelpDescriptor {
    access: CommandAccess;
    aliases: string[];
    category: string;
    channel: CommandChannel;
    name: string;
    sections: CommandHelpSection[];
}
export interface CommandHelpSection {
    argument: string | null;
    effect: string | null;
}
export interface ExpressionDescriptor {
    expr: RegExp;
    replacer: ExpressionReplacer;
}
export interface MeaningInfo {
    answers: string[];
    list: string[];
}
export interface MessageTarget {
    user: User;
    member: GuildMember | null;
    isMention: boolean;
    name: string;
}
export interface PollOption {
    text: string;
    votes: Set<string>;
    reaction: string;
}
export interface Runnable {
    run: (msg: Message, args: string[], target: MessageTarget) => Promise<any>;
}
export interface SaltyEmbedOptions extends MessageEmbedOptions {
    actions?: {
        reactions: string[];
        onAdd?: (
            reaction: MessageReaction,
            user: User,
            abort: () => void
        ) => void;
        onRemove?: (
            reaction: MessageReaction,
            user: User,
            abort: () => void
        ) => void;
        onEnd?: (
            collected: Collection<Snowflake, MessageReaction>,
            reason: string
        ) => void;
    };
    content?: string;
    inline?: boolean;
    react?: string;
}
export interface Song {
    duration: number;
    title: string;
    url: string;
}
export interface StatusInfo {
    title: string;
    color?: number;
}
export interface Waifu {
    readonly name: string;
    readonly anime: string;
    readonly image: string[];
}

export interface Weapon extends Item {
    multishot?: number;
    range?: number;
}

export type AvailableCategories =
    | "config"
    | "general"
    | "image"
    | "misc"
    | "music"
    | "text"
    | "warframe";
export type Categories = { [key in AvailableCategories]: string };
export type CommandAccess = "public" | "admin" | "dev" | "owner";
export type CommandAction = (actionparams: ActionParameters) => Promise<any>;
export type CommandChannel = "all" | "guild";
export type Dictionnary<T> = { [key: string]: T };
export type ExpressionReplacer = (match: string, context: any) => string;
export type FieldsDescriptor = Dictionnary<any>;
export type StatusInfos = { [status in PresenceStatusData]: StatusInfo };
