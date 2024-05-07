import { APIEmbedField, APIEmbedFooter } from "discord-api-types/v10";
import { EmbedField, MessageEmbedFooter } from "discord.js";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import { TEAM_CREATOR_FIELD_NAMES, TEAM_FIELD_NAMES } from "./modalSubmitHandler/utils/constants";

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
  return foundField?.value || "";
}

type UpdateEmbedFieldType = {
  /** Number of registered players */
  numRegisteredPlayers?: string;
  /** Number of max registered players */
  numMaxPlayers?: string;
  /** list/value of Registered players */
  registeredList?: string;
  /** Number of max teams */
  maxNumTeams?: string;
  /** Number of max team players */
  maxNumTeamPlayers?: string;
};

export function updateEmbedField(
  fields: EmbedField[] | APIEmbedField[] | undefined,
  {
    numRegisteredPlayers,
    numMaxPlayers,
    registeredList,
    maxNumTeams,
    maxNumTeamPlayers,
  }: UpdateEmbedFieldType,
) {
  return (
    fields?.map((field) => {
      if (field.name.includes(TEAM_CREATOR_FIELD_NAMES.maxNumOfTeams)) {
        return {
          ...field,
          value: maxNumTeams ? maxNumTeams : field.value,
        };
      }

      if (field.name.includes(TEAM_CREATOR_FIELD_NAMES.maxNumOfTeamPlayers)) {
        return {
          ...field,
          value: maxNumTeamPlayers ? maxNumTeamPlayers : field.value,
        };
      }

      if (field.name.includes(TEAM_FIELD_NAMES.registeredPlayers)) {
        // Case-insensitive regex
        const regex = /(\d+)\/((\d+)|unlimited|Unlimited)/i;
        const match = field.name.match(regex);

        if (match) {
          const completeRegexMatch = match[0]; // 1/unlimited
          const originalRegisteredPlayers = match[1]; // 1
          const originalMaxPlayers = match[2]; // unlimited

          const newRegisteredPlayers =
            numRegisteredPlayers !== undefined ? numRegisteredPlayers : originalRegisteredPlayers;

          const newMaxPlayers = numMaxPlayers !== undefined ? numMaxPlayers : originalMaxPlayers;

          const newName = `${field.name.split(completeRegexMatch)[0]}${newRegisteredPlayers}/${newMaxPlayers}`;

          return {
            ...field,
            name: newName,
            value:
              registeredList !== undefined
                ? registeredList.trim().length > 0
                  ? registeredList
                  : " "
                : field.value || " ",
          };
        }
      }
      return field;
    }) || []
  );
}

/**
 * Creates an updated embed with new provided fields, most likely due to `updateEmbedField()`
 *
 * @returns an updated MessageEmbed
 */
export function updateEmbed({
  title,
  description,
  fields,
  footer,
}: {
  title?: string | null;
  description?: string | null;
  fields: EmbedField[] | APIEmbedField[] | undefined;
  footer: MessageEmbedFooter | APIEmbedFooter | undefined | null;
}) {
  return new CustomMessageEmbed()
    .setTitle(title || "Undefined")
    .setDescription(description || "Undefined")
    .addFields(fields || [])
    .setFooter({ text: footer?.text || "Undefined" }).Info;
}

/**
 * Finds the Event ID from the given footer text.
 *
 * @param footer - The footer text containing the Event ID, possibly with a Team ID.
 * @returns The Event ID extracted from the footer text, or an empty string if not found.
 */
export function findFooterEventId(
  footer: MessageEmbedFooter | APIEmbedFooter | undefined | null,
): number {
  if (!footer) return 0;

  const eventIdMatch = footer.text.match(/Event ID: (\d+)/);
  return eventIdMatch ? parseInt(eventIdMatch[1]) : 0;
}

/**
 * Finds the Team ID from the given footer text.
 *
 * @param footer - The footer text containing the Event ID and possibly the Team ID.
 * @returns The Team ID extracted from the footer text, or an empty string if not found.
 */
export function findFooterTeamId(
  footer: MessageEmbedFooter | APIEmbedFooter | undefined | null,
): number {
  if (!footer) return 0;

  const teamIdMatch = footer.text.match(/Team ID: (\d+)/);
  return teamIdMatch ? parseInt(teamIdMatch[1]) : 0;
}

/**
 * Gets an array of registered players from the provided text
 *
 * Expected text argument: `player1Name\nplayer2Name` or `>>> player1Name\nplayer2Name`
 * @returns ["player1Name","player2Name"] (from example)
 */
export function getRegisteredPlayersFromEmbedField(text: string = "") {
  return text.replace(">>> ", "").replace(">>>", "")?.split("\n").filter(Boolean) || [];
}

/**
 * Gets the registered players from the provided text
 *
 * Expected text argument: `Registered players 0/2`, or, `Registered players 100/unlimited`
 * @returns 0 or 100 (from example)
 */
export function getRegisteredPlayersNumFromEmbed(text: string = "") {
  // Case-insensitive regex
  const registeredPlayersRegex = /(\d+)\/((\d+)|unlimited|Unlimited)/i;
  const match = text.match(registeredPlayersRegex);

  if (match) return parseInt(match[1], 10);

  return 0;
  // return text.split(" ")[2].split("/")[0].toString();
}

// /**
//  * Gets the max number of players from the provided text
//  *
//  * Expected text argument: `Registered players 0/2`, or, `Registered players 0/unlimited`
//  * @returns 2 or unlimited (from example)
//  */
// export function getMaxPlayersNumFromEmbed(text: string) {
//   // Case-insensitive regex
//   const maxPlayersRegex = /(\d+)\/((\d+)|unlimited|Unlimited)/i;
//   const match = text.match(maxPlayersRegex);

//   if (match) return match[2];

//   return 0;
//   // return text.split(" ")[2].split("/")[1].toString();
// }

// export function replaceRegisteredPlayers(text: string, registeredPlayers: string) {
//   // Case-insensitive regex
//   const regex = /(\d+)\/((\d+)|unlimited|Unlimited)/i;
//   const replacement = `${registeredPlayers}/$2`;
//   const newText = text.replace(regex, replacement);
//   return newText;
// }

// export function replaceMaxPlayers(text: string, maxPlayers: string) {
//   // Case-insensitive regex
//   const regex = /(\d+)\/((\d+)|unlimited|Unlimited)/i;
//   const replacement = `$1/${maxPlayers}`;
//   const newText = text.replace(regex, replacement);
//   return newText;
// }
