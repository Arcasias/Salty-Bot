import {
  Collection,
  GuildMember,
  Message,
  MessageEmbedOptions,
  MessageOptions,
  MessageReaction,
  PresenceStatusData,
  Snowflake,
  User,
} from "discord.js";
import Sailor from "../classes/Sailor";

//=============================================================================
// Interfaces
//=============================================================================

export interface ActionContext extends ParialActionContext {
  readonly send: ActionContextMessageHelpers;
}
export interface ActionContextMessageHelpers {
  embed: (options?: SaltyEmbedOptions) => Promise<Message | false>;
  error: (
    text?: string,
    options?: SaltyEmbedOptions
  ) => Promise<Message | false>;
  info: (
    text?: string,
    options?: SaltyEmbedOptions
  ) => Promise<Message | false>;
  message: (
    content?: string,
    options?: SaltyMessageOptions
  ) => Promise<Message | false>;
  success: (
    text?: string,
    options?: SaltyEmbedOptions
  ) => Promise<Message | false>;
  warn: (
    text?: string,
    options?: SaltyEmbedOptions
  ) => Promise<Message | false>;
}
export interface Banner {
  channelId: Snowflake;
  messageId: Snowflake;
  emojiRoles: [string, string][];
}
export interface BasicCommandDescriptor {
  readonly access?: CommandAccess;
  readonly aliases?: string[];
  readonly channel?: CommandChannel;
  readonly name: string;
}
export interface Category extends CategoryDescriptor {
  commands: string[];
  id: CategoryId;
}
export interface CategoryDescriptor {
  description: string;
  icon: string;
  name: string;
  order: number;
}
export interface CommandContext {}
export interface CommandDescriptor extends BasicCommandDescriptor {
  readonly action: CommandAction;
  readonly help?: CommandHelpSection[];
}
export interface CommandHelpDescriptor extends BasicCommandDescriptor {
  readonly sections: CommandHelpSection[];
  readonly category: CategoryId;
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
export interface MessageAction {
  onAdd?: (user: User, abort: () => void) => void;
  onRemove?: (user: User, abort: () => void) => void;
}
export interface MessageActionsDescriptor {
  actions: Collection<string, MessageAction>;
  onEnd?: (
    collected: Collection<Snowflake, MessageReaction>,
    reason: string
  ) => void;
}
export interface MessageActor {
  user: User;
  member: GuildMember | null;
  sailor: Sailor;
  name: string;
}
export interface Module {
  commands?: { category: CategoryId; command: CommandDescriptor }[];
  onLoad?: () => any;
  onMessage?: (msg: Message) => any;
}
export interface ParialActionContext {
  readonly alias: string;
  readonly args: string[];
  readonly msg: Message;
  readonly source: MessageActor;
  readonly targets: MessageActor[];
  readonly send: ActionContextMessageHelpers;
  run: (name: string, args?: string[]) => Promise<any>;
}
export interface PollOption {
  text: string;
  votes: Set<string>;
  reaction: string;
}
export interface SaltyEmbedOptions extends MessageEmbedOptions {
  content?: string;
  inline?: boolean;
  react?: string;
}
export interface SaltyMessageOptions extends MessageOptions {
  format?: boolean;
  title?: boolean;
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

export interface CharFieldOptions extends FieldOptions<string | string[]> {
  length: number;
}
export interface FieldOptions<T> {
  defaultValue?: T;
  nullable?: boolean;
}
export interface FieldDescriptor {
  name: string;
  defaultValue: any;
  nullable?: boolean;
  structure: FieldStructure;
  type: "CHAR" | "VARCHAR" | "BOOLEAN" | "SERIAL" | "TIMESTAMPTZ";
}
export interface FieldStructure {
  columnName: string;
  dataType: string;
  characterMaximumLength?: number;
  columnDefault?: any;
  isNullable: "YES" | "NO";
}

//=============================================================================
// Types
//=============================================================================

export type CategoryId =
  | "config"
  | "general"
  | "image"
  | "misc"
  | "text"
  | "quick"
  | "voice";
export type CommandAccess = "public" | "admin" | "dev" | "owner";
export type CommandAction = (actionContext: ActionContext) => Promise<any>;
export type CommandChannel = "all" | "guild";
export type Dictionnary<T> = { [key: string]: T };
export type ExpressionReplacer = (match: string, context: any) => string;
export type LogType = "debug" | "error" | "log" | "request" | "warn";
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
