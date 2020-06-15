import { Message } from "discord.js";
import { FieldsDescriptor, Runnable } from "../types";
import { choice } from "../utils";
import Command from "./Command";
import Model from "./Model";
import Salty from "./Salty";

class QuickCommand extends Model implements Runnable {
    public id!: number;
    public name!: string;
    public aliases!: string[];
    public answers!: string[];

    protected static readonly fields: FieldsDescriptor = {
        name: "",
        aliases: [],
        answers: [],
    };
    protected static readonly table = "commands";

    /**
     * @override
     */
    public static async create<T extends Model>(...allValues: any[]) {
        const commands = await super.create(...allValues);
        for (const command of commands) {
            const cmd = <QuickCommand>command;
            for (const key of cmd.aliases) {
                Command.aliases.set(key, cmd.name);
            }
            Command.list.set(cmd.name, cmd);
        }
        return <T[]>commands;
    }

    /**
     * @override
     */
    public static async load<T extends Model>() {
        const commands = await super.load();
        for (const command of commands) {
            const cmd = <QuickCommand>command;
            for (const key of cmd.aliases) {
                Command.aliases.set(key, cmd.name);
            }
            Command.list.set(cmd.name, cmd);
        }
        return <T[]>commands;
    }

    /**
     * @override
     */
    public static async remove<T extends Model>(...ids: number[]) {
        const commands = await super.remove(...ids);
        for (const command of commands) {
            const cmd = <QuickCommand>command;
            for (const key of cmd.aliases) {
                Command.aliases.delete(key);
            }
            Command.list.delete(cmd.name);
        }
        return <T[]>commands;
    }

    async run(msg: Message, args: string[]) {
        return Salty.message(msg, choice(this.answers));
    }
}

export default QuickCommand;
