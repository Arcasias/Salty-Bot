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
import Sailor from "./classes/Sailor";

export interface ActionParameters {
    readonly args: string[];
    readonly msg: Message;
    readonly source: MessageActor;
    readonly target: MessageActor | null;
}
export interface CommandCategoryDoc {
    description: string;
    icon: string;
    name: string;
}
export interface CommandCategoryInfo extends CommandCategoryDoc {
    commands: string[];
}
export interface CommandBasicDescriptor {
    readonly access?: CommandAccess;
    readonly aliases?: string[];
    readonly category: AvailableCategories;
    readonly channel?: CommandChannel;
    readonly name: string;
}
export interface CommandDescriptor extends CommandBasicDescriptor {
    readonly action: CommandAction;
    readonly help?: CommandHelpSection[];
}
export interface CommandHelpDescriptor extends CommandBasicDescriptor {
    readonly sections: CommandHelpSection[];
}
export interface CommandHelpSection {
    argument: string | null;
    effect: string | null;
}
export interface ExpressionDescriptor {
    expr: RegExp;
    replacer: ExpressionReplacer;
}
export interface Joke {
    text: string;
    answer?: string;
}
export interface MeaningInfo {
    answers: string[];
    list: string[];
}
export interface MessageActor {
    user: User;
    member: GuildMember | null;
    sailor: Sailor;
    name: string;
}
export interface PollOption {
    text: string;
    votes: Set<string>;
    reaction: string;
}
export interface Runnable {
    run: (
        msg: Message,
        args: string[],
        source: MessageActor,
        target: MessageActor | null
    ) => Promise<any>;
    type: CommandType;
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
    channel: string;
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

export type AvailableCategories =
    | "config"
    | "general"
    | "image"
    | "misc"
    | "text";
export type Categories = { [key in AvailableCategories]: string };
export type CommandAccess = "public" | "admin" | "dev" | "owner";
export type CommandAction = (actionparams: ActionParameters) => Promise<any>;
export type CommandChannel = "all" | "guild";
export type CommandType = "core" | "quick";
export type Dictionnary<T> = { [key: string]: T };
export type ExpressionReplacer = (match: string, context: any) => string;
export type FieldsDescriptor = Dictionnary<any>;
export type MeaningKeys = keyof Meanings | "string";
export type Meanings = {
    add: string[];
    bot: string[];
    default: string[];
    clear: string[];
    help: string[];
    list: string[];
    remove: string[];
    set: string[];
};
export type StatusInfos = { [status in PresenceStatusData]: StatusInfo };
