import fields from "../database/fields";
import Model from "./Model";

export default class Crew extends Model {
  public discordId!: string;
  public defaultChannel!: string | null;
  public defaultRole!: string | null;
  public roleBoxes!: string[];

  public static table: string = Crew.createTable("crews", [
    fields.snowflake("discordId"),
    fields.snowflake("defaultChannel", true),
    fields.snowflake("defaultRole", true),
    fields.varchar("roleBoxes", { length: 2000, defaultValue: [] }),
  ]);

  public static async get(discordId: string): Promise<Crew> {
    const results: Crew[] = await this.search({ discordId });
    return results[0] || null;
  }
}
