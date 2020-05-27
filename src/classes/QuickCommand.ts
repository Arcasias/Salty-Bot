import { Message } from "discord.js";
import { FieldsDescriptor, Runnable } from "../types";
import { choice } from "../utils";
import Model from "./Model";
import Salty from "./Salty";

class QuickCommand extends Model implements Runnable {
    public answers!: string[];
    public id!: number;
    public keys!: string[];
    public name!: string;

    protected static readonly fields: FieldsDescriptor = {
        answers: [],
        keys: [],
        name: "",
    };
    protected static readonly table = "commands";

    /**
     * @override
     */
    // public static async create(...allValues: any[]) {
    //     const commands = await super.create<QuickCommand>(...allValues);
    //     for (const command of commands) {
    //         for (const key of command.keys) {
    //             Command.aliases.set(key, command.name);
    //         }
    //         Command.list.set(command.name, command);
    //     }
    //     return commands;
    // }

    /**
     * @override
     */
    // public static async load() {
    //     const commands = await super.load<QuickCommand>();
    //     for (const command of commands) {
    //         for (const key of command.keys) {
    //             Command.aliases.set(key, command.name);
    //         }
    //         Command.list.set(command.name, command);
    //     }
    //     return commands;
    // }

    /**
     * @override
     */
    // public static async remove(...ids: number[]) {
    //     const commands = await super.remove<QuickCommand>(...ids);
    //     for (const command of commands) {
    //         for (const key of command.keys) {
    //             Command.aliases.delete(key);
    //         }
    //         Command.list.delete(command.name);
    //     }
    //     return commands;
    // }

    async run(msg: Message, args: string[]) {
        return Salty.message(msg, choice(this.answers));
    }
}

export default QuickCommand;
