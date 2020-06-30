import { FieldsDescriptor } from "../types";
import Model from "./Model";

class Sailor extends Model {
    public discord_id!: string;
    public black_listed!: boolean;
    public todos!: string[];

    protected static readonly fields: FieldsDescriptor = {
        discord_id: "",
        black_listed: false,
        todos: [],
    };
    protected static readonly table = "sailors";

    public static async get(discordId: string): Promise<Sailor | null> {
        const results: Sailor[] = await this.search({ discord_id: discordId });
        return results[0] || null;
    }
}

export default Sailor;