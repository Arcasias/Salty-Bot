import { CharFieldOptions, FieldDescriptor, FieldOptions } from "../typings";
import { jsToDbKey, jsToDbValue } from "./helpers";

export function boolean(
  name: string,
  { defaultValue }: FieldOptions<boolean> = {}
): FieldDescriptor {
  const defVal = Boolean(defaultValue);
  return {
    name,
    type: "BOOLEAN",
    defaultValue: defVal,
    nullable: false,
    structure: {
      columnName: jsToDbKey(name),
      dataType: "boolean",
      isNullable: "NO",
      columnDefault: String(defVal),
    },
  };
}

export function char(
  name: string,
  { length, nullable, defaultValue }: CharFieldOptions
): FieldDescriptor {
  const defVal = defaultValue || null;
  return {
    name,
    type: "CHAR",
    defaultValue: defVal,
    nullable,
    structure: {
      columnName: jsToDbKey(name),
      dataType: "character",
      characterMaximumLength: length,
      isNullable: nullable ? "YES" : "NO",
      columnDefault: jsToDbValue(defVal),
    },
  };
}

export function number(
  name: string,
  { nullable, defaultValue }: FieldOptions<number> = {}
): FieldDescriptor {
  const defVal = defaultValue || null;
  return {
    name,
    type: "DOUBLE PRECISION",
    defaultValue: defVal,
    nullable,
    structure: {
      columnName: jsToDbKey(name),
      dataType: "double precision",
      isNullable: nullable ? "YES" : "NO",
      columnDefault: jsToDbValue(defVal),
    },
  };
}

export function serial(name: string): FieldDescriptor {
  return {
    name,
    type: "SERIAL",
    defaultValue: null,
    nullable: false,
    structure: {
      columnName: jsToDbKey(name),
      dataType: "integer",
      isNullable: "NO",
    },
  };
}

export function snowflake(name: string, nullable?: boolean): FieldDescriptor {
  return char(name, { length: 18, nullable });
}

export function timestamp(name: string): FieldDescriptor {
  return {
    name,
    type: "TIMESTAMPTZ",
    defaultValue: "CURRENT_TIMESTAMP",
    nullable: false,
    structure: {
      columnName: jsToDbKey(name),
      dataType: "timestamp with time zone",
      isNullable: "NO",
    },
  };
}

export function varchar(
  name: string,
  { length, nullable, defaultValue }: CharFieldOptions
): FieldDescriptor {
  const defVal = defaultValue || null;
  return {
    name,
    type: "VARCHAR",
    defaultValue: defVal,
    nullable,
    structure: {
      columnName: jsToDbKey(name),
      dataType: "character varying",
      characterMaximumLength: length,
      isNullable: nullable ? "YES" : "NO",
      columnDefault: defVal && `'${jsToDbValue(defVal)}'::character varying`,
    },
  };
}

export default {
  boolean,
  char,
  number,
  serial,
  snowflake,
  timestamp,
  varchar,
};
