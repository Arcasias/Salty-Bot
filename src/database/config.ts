import { Dictionnary } from "../typings";
import { log } from "../utils/log";
import { registerTable } from "./autoDB";
import fields from "./fields";
import { read } from "./query";

const configTableName = registerTable("config", [
  fields.varchar("prefix", { length: 32, defaultValue: "$" }),
  fields.snowflake("ownerId"),
  fields.varchar("devIds", { length: 1000 }),
]);

export const config: Dictionnary<any> = {};

/**
 * Loads and returns the configuration variables from the database.
 */
export async function loadConfig(): Promise<Dictionnary<any>> {
  const [dbConfig] = await read(configTableName);
  for (const col in dbConfig) {
    config[col] = dbConfig[col];
  }
  log(`Configuration loaded: prefix is "${config.prefix}"`);
  return config;
}
