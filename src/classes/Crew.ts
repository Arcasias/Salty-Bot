import { FieldDescriptor } from "../typings";
import { fields } from "./Database";
import Model from "./Model";

class Crew extends Model {
  public discordId!: string;
  public defaultChannel!: string | null;
  public defaultRole!: string | null;

  public static readonly table: string = "crews";
  public static readonly fields: FieldDescriptor[] = [
    fields.snowflake("discordId"),
    fields.snowflake("defaultChannel", true),
    fields.snowflake("defaultRole", true),
  ];

  public static async get(discordId: string): Promise<Crew> {
    const results: Crew[] = await this.search({ discordId });
    return results[0] || null;
  }
}

Model.register(Crew);

export default Crew;
