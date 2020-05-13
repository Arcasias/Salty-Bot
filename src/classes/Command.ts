import { Message, User, GuildMember } from "discord.js";
import { debug, error } from "../utils";
import { PermissionDenied, SaltyException } from "./Exception";
import Salty from "./Salty";
import * as list from "../terms";

const permissions = {
    public: null,
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
    effect: string;
}

interface MessageTarget {
    user: User;
    member: GuildMember;
    isMention: boolean;
}

export interface CommandParams {
    args?: string[];
    msg?: Message;
    target?: MessageTarget;
}

export type CommandVisiblity = "public" | "admin" | "dev" | "owner";

abstract class Command {
    public readonly env: "local" | "server";
    public readonly help: CommandHelp[];
    public readonly keys: string[] = [];
    public readonly mode: string;
    public readonly name: string;
    public readonly visibility: CommandVisiblity = "public";

    abstract async action(commandParams: CommandParams): Promise<void>;

    /**
     * Runs the command action
     */
    public async run(msg: Message, args: string[]) {
        try {
            if (
                this.visibility !== "public" &&
                !permissions[this.visibility].call(Salty, msg.author, msg.guild)
            ) {
                throw new PermissionDenied(this.visibility);
            }
            if (this.env && this.env !== process.env.MODE) {
                debug(this.name, this.env);
                throw new SaltyException(
                    "WrongEnvironment",
                    "it looks like I'm not in the right environment to do that"
                );
            }
            const mentioned = Boolean(msg.mentions.users.size);
            const target: MessageTarget = {
                user: mentioned ? msg.mentions.users.first() : msg.author,
                member: mentioned ? msg.mentions.members.first() : msg.member,
                isMention: mentioned,
            };
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
                MEANING_ACTIONS.find(
                    (w) => list[w] && list[w].includes(word)
                ) || "string"
            );
        } else {
            return "noarg";
        }
    }
}

export default Command;
