import { Message } from "discord.js";
import salty from "../salty";
import { CommandType, Dictionnary, FieldsDescriptor, Runnable } from "../types";
import { choice } from "../utils";
import Command from "./Command";
import Model from "./Model";

class QuickCommand extends Model implements Runnable {
    public name!: string;
    public aliases!: string[];
    public answers!: string[];
    public type: CommandType = "quick";

    public static readonly fields: FieldsDescriptor = {
        name: "",
        aliases: [],
        answers: [],
    };
    public static readonly table = "commands";

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
     * Returns the list of instances fetched from the attached database table.
     */
    public static async load(): Promise<QuickCommand[]> {
        const records: FieldsDescriptor[] = await this.search({});
        const commands = records.map((values) => new this(values));
        for (const cmd of commands) {
            for (const alias of cmd.aliases) {
                Command.aliases.set(alias, cmd.name);
            }
            Command.list.set(cmd.name, cmd);
        }
        return commands;
    }

    /**
     * @override
     */
    public static async remove<T extends Model>(
        idsOrWhere: number | number[] | Dictionnary<any>
    ) {
        const commands = await super.remove(idsOrWhere);
        for (const command of commands) {
            const cmd = <QuickCommand>command;
            for (const alias of cmd.aliases) {
                Command.aliases.delete(alias);
            }
            Command.list.delete(cmd.name);
        }
        return <T[]>commands;
    }

    async run(msg: Message, args: string[]) {
        return salty.message(msg, choice(this.answers));
    }
}

export default QuickCommand;
