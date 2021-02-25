import { Guild, Role, Snowflake, TextChannel } from "discord.js";
import fields from "../database/fields";
import Model from "./Model";

export default class Crew extends Model {
  public discordId!: Snowflake;
  public defaultChannel!: Snowflake | null;
  public defaultRole!: Snowflake | null;
  public roleBoxes!: string[];

  public static table: string = Crew.defineTable("crews", [
    fields.snowflake("discordId"),
    fields.snowflake("defaultChannel", true),
    fields.snowflake("defaultRole", true),
    fields.varchar("roleBoxes", { length: 2000, defaultValue: [] }),
  ]);

  /**
   * Checks if the default channel is still valid. If invalid, it will be
   * automatically deleted.
   * @param guild
   */
  public getDefaultChannel(guild: Guild): TextChannel | false {
    if (!this.defaultChannel) {
      return false;
    }
    const channel = guild.channels.cache.get(this.defaultChannel);
    if (!channel || !(channel instanceof TextChannel)) {
      this.update({ defaultChannel: null });
      return false;
    }
    return channel;
  }

  /**
   * Checks if the default channel is still valid. If invalid, it will be
   * automatically deleted.
   * @param guild
   */
  public getDefaultRole(guild: Guild): Role | false {
    if (!this.defaultRole) {
      return false;
    }
    const role = guild.roles.cache.get(this.defaultRole);
    if (!role) {
      this.update({ defaultRole: null });
      return false;
    }
    return role;
  }

  public static async get(discordId: string): Promise<Crew> {
    const results: Crew[] = await this.search({ discordId });
    return results[0] || null;
  }
}
