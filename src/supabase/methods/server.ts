import { supabase } from "supabaseDB/index";
import { throwFormattedErrorLog } from "utils/logging/errorFormats";

export const createServerDB = async (guildId: string, name: string) => {
  const { data, error } = await supabase
    .from("DiscordServers")
    .insert({ serverId: guildId, name })
    .select("id")
    .single();

  if (error) throw throwFormattedErrorLog(error);

  return data.id;
};

export const getServerIdDB = async (guildId: string | null) => {
  if (!guildId) return null;

  const { data, error } = await supabase
    .from("DiscordServers")
    .select("id")
    .eq("serverId", guildId)
    .single();

  if (error) {
    // ? No server found
    throwFormattedErrorLog(error);
    return null;
  }

  return data.id;
};

export const checkOrCreateServerDB = async (guildId: string, serverName: string) => {
  const id = await getServerIdDB(guildId);

  if (!id) return await createServerDB(guildId, serverName);

  return id;
};
