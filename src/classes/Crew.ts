import { FieldsDescriptor } from "../types";
import Model from "./Model";

class Crew extends Model {
    public discord_id!: string;
    public default_channel!: string | null;
    public default_role!: string | null;

    protected static readonly fields: FieldsDescriptor = {
        discord_id: "",
        default_channel: null,
        default_role: null,
    };
    protected static readonly table: string = "crews";

    public static async get(discordId: string): Promise<Crew> {
        const results: Crew[] = await this.search({ discord_id: discordId });
        return results[0] || null;
    }
}

export default Crew;
