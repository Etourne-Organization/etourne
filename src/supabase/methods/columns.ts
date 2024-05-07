import { supabase } from "supabaseDB/index";
import { Events, Teams } from "supabaseDB/types";
import { throwFormattedErrorLog } from "utils/logging/errorFormats";
import { performEventUpdateDB } from "./events";
import { performTeamUpdateDB } from "./players";

type ColumnResult<T extends keyof U, U> = { [K in T]?: U[K] };

// ? using signatures to force conditional return type
export async function getTeamColumnDB<T extends keyof Teams>(
  id: number,
  columnName: T,
  expectArray: true,
  viaEventId?: boolean,
): Promise<Teams[T][]>;
export async function getTeamColumnDB<T extends keyof Teams>(
  id: number,
  columnName: (keyof Teams)[],
  expectArray: true,
  viaEventId?: boolean,
): Promise<ColumnResult<T, Teams>[]>;
export async function getTeamColumnDB<T extends keyof Teams>(
  id: number,
  columnName: T,
  expectArray?: false,
  viaEventId?: boolean,
): Promise<Teams[T]>;
export async function getTeamColumnDB<T extends keyof Teams>(
  id: number,
  columnName: (keyof Teams)[],
  expectArray?: false,
  viaEventId?: boolean,
): Promise<ColumnResult<T, Teams>>;
export async function getTeamColumnDB<T extends keyof Teams>(
  id: number,
  columnName: T | (keyof Teams)[],
  expectArray: boolean = false,
  viaEventId: boolean = false,
): Promise<Teams[T] | ColumnResult<T, Teams> | Teams[T][] | ColumnResult<T, Teams>[]> {
  const isColumnArray = Array.isArray(columnName);

  if (expectArray) {
    const { data, error } = await supabase
      .from("Teams")
      .select(isColumnArray ? columnName.join(",") : columnName)
      .eq(viaEventId ? "eventId" : "id", id);

    if (error) throwFormattedErrorLog(error);

    if (isColumnArray) return data as unknown as ColumnResult<T, Teams>[];
    return data as unknown as Teams[T][];
  }

  const { data, error } = await supabase
    .from("Teams")
    .select(isColumnArray ? columnName.join(",") : columnName)
    .eq(viaEventId ? "eventId" : "id", id)
    .single();

  if (error) throwFormattedErrorLog(error);

  if (isColumnArray) return data as unknown as ColumnResult<T, Teams>;
  return (data as unknown as Teams)[columnName];
}

export async function getEventColumnDB<T extends keyof Events>(
  id: number,
  columnName: T,
): Promise<Events[T]>;
export async function getEventColumnDB<T extends keyof Events>(
  id: number,
  columnName: (keyof Events)[],
): Promise<ColumnResult<T, Events>>;
export async function getEventColumnDB<T extends keyof Events>(
  id: number,
  columnName: T | (keyof Events)[],
): Promise<Events[T] | ColumnResult<T, Events>> {
  const isColumnArray = Array.isArray(columnName);

  const { data, error } = await supabase
    .from("Events")
    .select(isColumnArray ? columnName.join(",") : columnName)
    .eq("id", id)
    .single();

  if (error) throwFormattedErrorLog(error);

  if (isColumnArray) return data as unknown as ColumnResult<T, Events>;
  return (data as unknown as Events)[columnName];
}

export const updateEventColumnsDB = async <K extends keyof Events>(
  primaryKey: number,
  data: { key: K; value: Events[K] }[],
) => {
  const newObj: Partial<Events> = {};

  for (const d of data) {
    newObj[d.key] = d.value;
  }
  const id = await performEventUpdateDB(primaryKey, newObj);

  return id;
};

export const updateTeamColumnsDB = async <K extends keyof Teams>(
  primaryKey: number,
  data: { key: K; value: Teams[K] }[],
) => {
  const newObj: Partial<Teams> = {};

  for (const d of data) {
    newObj[d.key] = d.value;
  }
  const id = await performTeamUpdateDB(primaryKey, newObj);

  return id;
};
