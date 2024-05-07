import { validateServerExists } from "src/interactionHandlers/validate";
import { supabase } from "supabaseDB/index";
import { Events } from "supabaseDB/types";
import { throwFormattedErrorLog } from "utils/logging/errorFormats";

export const getEventDB = async (eventIdPK: number): Promise<Events | null> => {
  const { data, error } = await supabase.from("Events").select().eq("id", eventIdPK).single();

  if (error)
    if (error) {
      throwFormattedErrorLog(error);
      return null;
    }

  return data;
};

export const getAllServerEventColumnsDB = async (serverId: number): Promise<Events[] | null> => {
  const { data, error } = await supabase.from("Events").select("*").eq("serverId", serverId);

  if (error) {
    // ? No server events found
    throwFormattedErrorLog(error);
    return null;
  }

  return data;
};

type CreateEventTypes = {
  eventName: string;
  gameName: string;
  eventHost: string;
  description: string;
  dateTime: string;
  isTeamEvent: boolean;
  serverId: number;
  timezone: string;
  channelId: string;
};

export const createEventDB = async ({
  eventName,
  gameName,
  eventHost,
  description,
  dateTime,
  isTeamEvent,
  serverId,
  timezone,
  channelId,
}: CreateEventTypes) => {
  const { data, error } = await supabase
    .from("Events")
    .insert({
      eventName,
      eventHost,
      gameName,
      description,
      dateTime,
      isTeamEvent,
      serverId,
      timezone,
      channelId,
    })
    .select()
    .single();

  if (error) throw throwFormattedErrorLog(error);

  return data.id;
};

type UpdateEventTypes = {
  eventName: string;
  gameName: string;
  eventId: number;
  description: string;
  dateTime: string | null;
  isTeamEvent: boolean;
  guildId: string;
  timezone: string;
};

export const updateEventDB = async ({
  guildId, // ? TODO: possibly no need for guildId validation
  eventId,
  eventName,
  gameName,
  description,
  dateTime,
  isTeamEvent = false,
  timezone,
}: UpdateEventTypes) => {
  const { isValid, value: serverId } = await validateServerExists(guildId);
  if (!isValid) throw throwFormattedErrorLog("Guild does not exist!");

  const newObj: Partial<Events> = {
    eventName,
    gameName,
    description,
    isTeamEvent,
    serverId,
    timezone,
  };

  if (dateTime) newObj.dateTime = dateTime;

  const data = await performEventUpdateDB(eventId, newObj);

  return data;
};

export const deleteEventDB = async (eventId: number) => {
  const { error } = await supabase.from("Events").delete().eq("id", eventId);

  if (error) throw throwFormattedErrorLog(error);
};

export const performEventUpdateDB = async (id: number, newData: Partial<Events>) => {
  const { data, error } = await supabase
    .from("Events")
    .update(newData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw throwFormattedErrorLog(error);

  return data.id;
};
