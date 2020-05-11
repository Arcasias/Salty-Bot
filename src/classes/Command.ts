import { Message } from "discord.js";
import { debug, error } from "../utils";
import {
    DeprecatedCommand,
    PermissionDenied,
    SaltyException,
} from "./Exception";
import Model from "./Model";
import Salty from "./Salty";

const permissions = {
    public: null,
    admin: Salty.isAdmin,
    dev: Salty.isDev,
    owner: Salty.isOwner,
};
const MEANING_ACTIONS = [
    "add",
    "delete",
    "clear",
    "list",
    "bot",
    "buy",
    "sell",
];

interface CommandAction {
    (msg: Message, args: string[]): Promise<void>;
}

interface CommandHelp {
    argument: string | null;
    effect: string;
}

class Command extends Model {
    public action: CommandAction;
    public deprecated: boolean;
    public help: CommandHelp[];
    public keys: string[];
    public name: string;
    public visibility: string;
    public env: string;

    /**
     * Runs the command action
     */
    public async run(msg: Message, args: string[]) {
        try {
            if (this.deprecated) {
                throw new DeprecatedCommand(this.name);
            }
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
            await this.action(msg, args);
        } catch (err) {
            if (err instanceof SaltyException) {
                return Salty.error(msg, err.message);
            } else {
                error(err.stack);
            }
        }
    }

    public meaning(word?: string): string {
        if (word && word.length) {
            return (
                MEANING_ACTIONS.find((w) => Salty.getList(w).includes(word)) ||
                "string"
            );
        } else {
            return "noarg";
        }
    }
}

export default Command;
