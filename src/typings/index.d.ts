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

export interface ActionParameters {
  readonly args: string[];
  readonly msg: Message;
  readonly source: MessageActor;
  readonly targets: MessageActor[];
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

export type CategoryId =
  | "config"
  | "general"
  | "image"
  | "misc"
  | "text"
  | "quick"
  | "voice";
export type CommandAccess = "public" | "admin" | "dev" | "owner";
export type CommandAction = (actionparams: ActionParameters) => Promise<any>;
export type CommandChannel = "all" | "guild";
export type Dictionnary<T> = { [key: string]: T };
export type ExpressionReplacer = (match: string, context: any) => string;
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
