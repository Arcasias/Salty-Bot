import { FieldDescriptor } from "../typings";
import { fields } from "./Database";
import Model from "./Model";

class Sailor extends Model {
  public discordId!: string;
  public blackListed!: boolean;
  public todos!: string[];

  public static readonly table = "sailors";
  public static readonly fields: FieldDescriptor[] = [
    fields.snowflake("discordId"),
    fields.boolean("blackListed"),
    fields.varchar("todos", { length: 2000 }),
  ];

  public static async get(discordId: string): Promise<Sailor | null> {
    const results: Sailor[] = await this.search({ discordId });
    return results[0] || null;
  }
}

Model.register(Sailor);

export default Sailor;
