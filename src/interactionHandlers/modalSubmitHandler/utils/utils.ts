import { tz } from "moment";
import {
  getTimezoneValueFromLabel,
  isoParsingDateFormat,
  isoTimeFormat,
} from "utils/timezone/timezone";

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
