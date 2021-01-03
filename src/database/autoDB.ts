import { log, warn } from "console";
import { Dictionnary, FieldDescriptor, FieldStructure } from "../typings";
import { groupBy } from "../utils/generic";
import { buildFieldQuery, getClient, sanitize } from "./helpers";
import { read } from "./query";

/**
 * @todo: doc
 */
const registeredTables: Dictionnary<FieldDescriptor[]> = {};

/**
 * @todo: doc
 */
export async function adjustDatabase(): Promise<void> {
  const client = getClient("adjustDatabase");
  const dbColumns = await read("information_schema.columns", {
    tableSchema: "public",
  });
  const dbTables = groupBy(dbColumns, "tableName");
  const adjustments: string[] = [];
  const tasks: Promise<any>[] = [];

  // Excess tables
  for (const tableName in dbTables) {
    if (!(tableName in registeredTables)) {
      tasks.push(client.query(`DROP TABLE ${sanitize(tableName)}`));
      adjustments.push(`dropped table "${tableName}"`);
      delete dbTables[tableName];
    }
  }

  // Missing tables
  for (const tableName in registeredTables) {
    if (!(tableName in dbTables)) {
      const columns = registeredTables[tableName];
      const hasIdField = columns.some(({ name }) => name === "id");
      const query = `CREATE TABLE ${sanitize(tableName)} (${columns
        .map(buildFieldQuery)
        .join(", ")}${hasIdField ? ", PRIMARY KEY(id)" : ""});`;
      tasks.push(client.query(query));
      adjustments.push(
        `created table "${tableName}" (${columns.length} columns)`
      );
    }
  }

  // Existing tables: check columns
  for (const tableName in dbTables) {
    const dbTable = dbTables[tableName];
    const refTable = registeredTables[tableName];
    const existingColumns: [any, FieldDescriptor][] = [];

    // Excess columns
    for (const dbCol of dbTable) {
      const refColumn = refTable.find(
        (refCol) => refCol.structure.columnName === dbCol.columnName
      );
      if (refColumn) {
        existingColumns.push([dbCol, refColumn]);
      } else {
        tasks.push(
          client.query(
            `ALTER TABLE ${sanitize(tableName)} DROP COLUMN ${
              dbCol.columnName
            };`
          )
        );
        adjustments.push(
          `dropped column "${dbCol.columnName}" from table "${tableName}"`
        );
      }
    }

    // Missing columns
    for (const refCol of refTable) {
      if (
        !dbTable.some(
          (dbCol) => dbCol.columnName === refCol.structure.columnName
        )
      ) {
        tasks.push(
          client.query(
            `ALTER TABLE ${sanitize(tableName)} ADD COLUMN ${buildFieldQuery(
              refCol
            )};`
          )
        );
        adjustments.push(
          `added column "${refCol.structure.columnName}" into table "${tableName}"`
        );
      }
    }

    // Existing columns
    for (const [dbCol, field] of existingColumns) {
      const mismatch = Object.keys(field.structure).some(
        (k) => field.structure[k as keyof FieldStructure] !== dbCol[k]
      );
      if (mismatch) {
        tasks.push(
          client.query(
            `ALTER TABLE ${sanitize(tableName)} DROP COLUMN ${
              dbCol.columnName
            };`
          ),
          client.query(
            `ALTER TABLE ${sanitize(tableName)} ADD COLUMN ${buildFieldQuery(
              field
            )};`
          )
        );
        adjustments.push(
          `replaced column "${dbCol.columnName}" with "${field.structure.columnName}" in table "${tableName}"`
        );
      }
    }
  }

  await Promise.all(tasks);
  if (adjustments.length) {
    warn(
      `The following database adjustments have been performed:\n${adjustments
        .map((a) => `> ${a}`)
        .join("\n")}`
    );
  } else {
    log("Database is compliant with the models definition");
  }
}

/**
 * @param tableName
 * @param columns
 */
export function registerTable(
  tableName: string,
  columns: FieldDescriptor[]
): string {
  if (tableName !== sanitize(tableName)) {
    throw new Error(`Incorrect table name: "${tableName}"`);
  }
  if (tableName in registeredTables) {
    throw new Error(`Table with name "${tableName}" already exists.`);
  }
  for (const { name } of columns) {
    if (name !== sanitize(name)) {
      throw new Error(
        `Incorrect column name: "${name}" in table "${tableName}"`
      );
    }
  }
  registeredTables[tableName] = columns;
  return tableName;
}
