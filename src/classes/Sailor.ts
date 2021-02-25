import fields from "../database/fields";
import Model from "./Model";

export default class Sailor extends Model {
  public discordId!: string;
  public blackListed!: boolean;
  public todos!: string[];

  public static table = Sailor.defineTable("sailors", [
    fields.snowflake("discordId"),
    fields.boolean("blackListed"),
    fields.varchar("todos", { length: 2000, defaultValue: [] }),
  ]);

  public static async get(discordId: string): Promise<Sailor | null> {
    const results: Sailor[] = await this.search({ discordId });
    return results[0] || null;
  }
}
