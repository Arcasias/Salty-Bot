import { FieldsDescriptor } from "../typings";
import Model from "./Model";

export default class Crew extends Model {
  public discord_id!: string;
  public default_channel!: string | null;
  public default_role!: string | null;

  public static readonly fields: FieldsDescriptor = {
    discord_id: "",
    default_channel: null,
    default_role: null,
  };
  public static readonly table: string = "crews";

  public static async get(discordId: string): Promise<Crew> {
    const results: Crew[] = await this.search({ discord_id: discordId });
    return results[0] || null;
  }
}
