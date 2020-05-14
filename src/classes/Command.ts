import { Message, User, GuildMember } from "discord.js";
import { debug, error } from "../utils";
import { PermissionDenied, SaltyException } from "./Exception";
import Salty from "./Salty";
import * as list from "../terms";

const permissions = {
    admin: Salty.isAdmin,
    dev: Salty.isDev,
    owner: Salty.isOwner,
};
const MEANING_ACTIONS = [
    "add",
    "remove",
    "clear",
    "list",
    "bot",
    "buy",
    "sell",
];

interface CommandHelp {
    argument: string | null;
    effect: string | null;
}

interface MessageTarget {
    user: User;
    member: GuildMember | null;
    isMention: boolean;
    name: string;
}

export interface CommandParams {
    args: string[];
    msg: Message;
    target: MessageTarget;
}

export type CommandAccess = "public" | "admin" | "dev" | "owner";
export type CommandEnvironment = "all" | "local" | "server";
export type CommandChannel = "all" | "guild";

abstract class Command {
    // Infos
    public readonly help: CommandHelp[] = [];
    public readonly keys: string[] = [];
    public readonly name: string = "";
    // Restrictions
    public readonly access: CommandAccess = "public";
    public readonly environment: CommandEnvironment = "all";
    public readonly channel: CommandChannel = "all";

    abstract async action(commandParams: CommandParams): Promise<void>;

    /**
     * Runs the command action
     */
    public async run(msg: Message, args: string[]) {
        try {
            if (
                this.access !== "public" &&
                msg.guild &&
                !permissions[this.access].call(Salty, msg.author, msg.guild)
            ) {
                throw new PermissionDenied(this.access);
            }
            if (
                this.environment !== "all" &&
                this.environment !== process.env.MODE
            ) {
                throw new SaltyException(
                    "WrongEnvironment",
                    "it looks like I'm not in the right environment to do that"
                );
            }
            if (this.channel === "guild" && !msg.guild) {
                throw new SaltyException(
                    "WrongChannel",
                    "this is a direct message channel retard"
                );
            }
            const mentioned = Boolean(msg.mentions.users.size);
            const target: MessageTarget = {
                user: mentioned ? msg.mentions.users.first()! : msg.author,
                member: mentioned ? msg.mentions.members!.first()! : msg.member,
                isMention: mentioned,
                name: "",
            };
            target.name = target.member?.displayName || target.user.username;
            const commandParams: CommandParams = { msg, args, target };
            await this.action(commandParams);
        } catch (err) {
            if (err instanceof SaltyException) {
                return Salty.error(msg, err.message);
            } else {
                error(err.stack);
            }
        }
    }

    protected meaning(word?: string): string {
        if (word) {
            return (
                MEANING_ACTIONS.find((w) => list[w]?.includes(word)) || "string"
            );
        } else {
            return "noarg";
        }
    }
}

export default Command;
