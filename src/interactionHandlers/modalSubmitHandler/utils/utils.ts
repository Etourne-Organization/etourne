import { APIEmbedField } from "discord-api-types/v10";
import { EmbedField } from "discord.js";
import { tz } from "moment";
import {
  getTimezoneValueFromLabel,
  isoParsingDateFormat,
  isoTimeFormat,
} from "utils/timezone/timezone";

/**
 * Finds an embed field in the given fields array based on the provided value to find.
 *
 * @param fields - An array of EmbedField or APIEmbedField objects, or undefined.
 * @param valueToFind - The string value to search for in the field names.
 * @param fullObj - If true, returns the entire EmbedField or APIEmbedField object. If false, returns the field value as a string.
 * @returns if `fullObj`=`false`, returns the value of the EmbedField
 * @returns if `fullObj`=`true`, returns the EmbedField object
 */
// ? using signatures to force conditional return type
export function findEmbedField(
  fields: EmbedField[] | APIEmbedField[] | undefined,
  valueToFind: string,
  fullObj: true,
): EmbedField | undefined;
export function findEmbedField(
  fields: EmbedField[] | APIEmbedField[] | undefined,
  valueToFind: string,
  fullObj?: false,
): string;
export function findEmbedField(
  fields: EmbedField[] | APIEmbedField[] | undefined,
  valueToFind: string,
  fullObj?: boolean,
): (EmbedField | APIEmbedField | undefined) | string {
  const foundField = fields?.find((field) => field.name.includes(valueToFind));

  if (fullObj) return foundField;
  else return foundField?.value || "";
}

/**
 * Converts an input time string to a timezone-specific formatted time or ISO string.
 *
 * @param time - The input time string in the format "YYYY-MM-DD HH:mm".
 * @param timezone - The timezone label to use for conversion.
 * @param forDB - If true, returns the converted time as an ISO string suitable for storing in a database. If false, returns a formatted time string using Discord's timestamp format.
 * @returns The converted time string in the desired format.
 */
export function inputToTimezone(time: string, timezone: string, forDB: boolean = false) {
  const [date, timeStr] = time.split(" ");
  const parsedTime = tz(
    `${date}T${timeStr}`,
    `${isoParsingDateFormat}T${isoTimeFormat}`,
    getTimezoneValueFromLabel(timezone),
  );

  if (!forDB) return `<t:${parsedTime.unix()}:F>`;

  return new Date(parsedTime.format()).toISOString();
}
