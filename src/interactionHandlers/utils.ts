import BOT_CONFIGS from "botConfig";
import { APIEmbedField, APIEmbedFooter } from "discord-api-types/v10";
import { EmbedField, MessageEmbed, MessageEmbedFooter } from "discord.js";
import { TEAM_FIELD_NAMES } from "./modalSubmitHandler/utils/constants";

export function getRegisteredPlayersFromEmbedField(text: string = "") {
  return text.replace(">>>", '')?.split("\n").filter(Boolean) || [];
}

/**
 * Gets the registered players from the provided text
 *
 * Expected text argument: `Registered players 0/2`, or, `Registered players 100/unlimited`
 * @returns 0 or 100 (from example)
 *
 */
export function getRegisteredPlayersNumFromEmbed(text: string = "") {
  // Case-insensitive regex
  const registeredPlayersRegex = /(\d+)\/((\d+)|unlimited|Unlimited)/i;
  const match = text.match(registeredPlayersRegex);

  if (match) return parseInt(match[1], 10);

  return 0;
  // return text.split(" ")[2].split("/")[0].toString();
}

/**
 * Gets the max number of players from the provided text
 *
 * Expected text argument: `Registered players 0/2`, or, `Registered players 0/unlimited`
 * @returns 2 or unlimited (from example)
 */
export function getMaxPlayersNumFromEmbed(text: string) {
  // Case-insensitive regex
  const maxPlayersRegex = /(\d+)\/((\d+)|unlimited|Unlimited)/i;
  const match = text.match(maxPlayersRegex);

  if (match) return match[2];

  return 0;
  // return text.split(" ")[2].split("/")[1].toString();
}

export function replaceRegisteredPlayers(text: string, registeredPlayers: string) {
  // Case-insensitive regex
  const regex = /(\d+)\/((\d+)|unlimited|Unlimited)/i;
  const replacement = `${registeredPlayers}/$2`;
  const newText = text.replace(regex, replacement);
  return newText;
}

export function replaceMaxPlayers(text: string, maxPlayers: string) {
  // Case-insensitive regex
  const regex = /(\d+)\/((\d+)|unlimited|Unlimited)/i;
  const replacement = `$1/${maxPlayers}`;
  const newText = text.replace(regex, replacement);
  return newText;
}

type UpdateEmbedFieldType = {
  /** Number of registered players */
  numRegisteredPlayers?: string;
  /** Number of max registered players */
  numMaxPlayers?: string;
  /** list/value of Registered players */
  registeredList?: string;
};

export function updateEmbedField(
  fields: EmbedField[] | APIEmbedField[] | undefined,
  { numRegisteredPlayers, numMaxPlayers, registeredList }: UpdateEmbedFieldType,
) {
  return fields?.map((field) => {
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
              : field.value,
        };
      }
    }
    return field;
  }) || [];
}

type UpdateEmbedType = {
  title?: string | null;
  description?: string | null;
  fields: EmbedField[] | APIEmbedField[] | undefined;
  footer: MessageEmbedFooter | APIEmbedFooter | undefined | null;
};

export function updateEmbed({ title, description, fields, footer }: UpdateEmbedType) {
  return new MessageEmbed()
    .setColor(BOT_CONFIGS.color.default)
    .setTitle(title || "Undefined")
    .setDescription(description || "Undefined")
    .addFields(fields || [])
    .setFooter({ text: footer?.text || "Undefined" });
}

/**
 * Finds the Event ID from the given footer text.
 *
 * @param footer - The footer text containing the Event ID, possibly with a Team ID.
 * @returns The Event ID extracted from the footer text, or an empty string if not found.
 */
export function findFooterEventId(
  footer: MessageEmbedFooter | APIEmbedFooter | undefined | null,
): string {
  if (!footer) return "";

  const eventIdMatch = footer.text.match(/Event ID: (\d+)/);
  return eventIdMatch ? eventIdMatch[1] : "";
}

/**
 * Finds the Team ID from the given footer text.
 *
 * @param footer - The footer text containing the Event ID and possibly the Team ID.
 * @returns The Team ID extracted from the footer text, or an empty string if not found.
 */
export function findFooterTeamId(
  footer: MessageEmbedFooter | APIEmbedFooter | undefined | null,
): string {
  if (!footer) return "";

  const teamIdMatch = footer.text.match(/Team ID: (\d+)/);
  return teamIdMatch ? teamIdMatch[1] : "";
}
