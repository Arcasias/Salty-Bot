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
    readonly name: string;
    readonly help?: CommandHelpSection[];
    readonly keys?: string[];
    readonly access?: CommandAccess;
    readonly channel?: CommandChannel;
}
export interface CommandHelpDescriptor {
    access: CommandAccess;
    category: string;
    channel: CommandChannel;
    keys: string[];
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
        onAdd?: (reaction: MessageReaction, user: User) => void;
        onRemove?: (reaction: MessageReaction, user: User) => void;
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

export type Categories = { [category: string]: string };
export type CommandAccess = "public" | "admin" | "dev" | "owner";
export type CommandAction = (actionparams: ActionParameters) => Promise<any>;
export type CommandChannel = "all" | "guild";
export type ExpressionReplacer = (match: string, context: any) => string;
export type FieldsDescriptor = { [field: string]: any };
export type StatusInfos = { [status in PresenceStatusData]: StatusInfo };
