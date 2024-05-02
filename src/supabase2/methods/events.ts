import { supabase } from "supabaseDB/index";
import { Events, Teams } from "utils/dbTypes";
import { throwFormattedErrorLog } from "utils/logging/errorFormats";

type ColumnResult<T extends keyof Events> = { [K in T]?: Events[K] };

export const getEventColumns = async <T extends keyof Events>(props: {
  columnName: T | T[];
  id: number;
}): Promise<ColumnResult<T>[]> => {
  const { columnName, id } = props;

  const isColumnArray = Array.isArray(columnName);

  const { data, error } = await supabase
    .from("Events")
    .select(isColumnArray ? columnName.join(",") : columnName)
    .eq("id", id);

  if (error) throwFormattedErrorLog(error);

  return data as unknown as ColumnResult<T>[];
};

type ColumnResultTeams<T extends keyof Teams> = { [K in T]?: Teams[K] };

export const getTeamColumns = async <T extends keyof Teams>(props: {
  columnName: T | T[];
  id: number;
}): Promise<ColumnResultTeams<T>[]> => {
  const { columnName, id } = props;

  const isColumnArray = Array.isArray(columnName);

  const { data, error } = await supabase
    .from("Teams")
    .select(isColumnArray ? columnName.join(",") : columnName)
    .eq("id", id);

  if (error) throwFormattedErrorLog(error);

  return data as unknown as ColumnResultTeams<T>[];
};
