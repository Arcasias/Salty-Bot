import { Message, User, GuildMember } from "discord.js";
import { debug, error } from "../utils";
import { PermissionDenied, SaltyException } from "./Exception";
import Model, { FieldsDescriptor } from "./Model";
import Salty from "./Salty";
import * as list from "../list";

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

type CommandAction = (commandParams: CommandParams) => Promise<void>;

interface CommandHelp {
    argument: string | null;
    effect: string;
}

interface CommandDescriptor {
    action: CommandAction;
    help?: CommandHelp[];
    keys: string[];
    mode?: string;
    name: string;
    visibility?: string;
    env?: string | null;
}

interface MessageTarget {
    user: User;
    member: GuildMember;
    isMention: boolean;
}

interface CommandParams {
    msg: Message;
    args: string[];
    target?: MessageTarget;
}

class Command extends Model {
    public action: CommandAction;
    public help: CommandHelp[];
    public keys: string[];
    public mode: string;
    public name: string;
    public visibility: string;
    public env: string | null;

    protected static readonly fields: FieldsDescriptor = {
        action: null,
        help: [],
        keys: [],
        name: "",
        visibility: "public",
        env: null,
    };

    constructor(values: CommandDescriptor) {
        super(values);
    }

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

    public meaning(word?: string): string {
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
