import { ModalSubmitInteraction } from "discord.js";

import { getRegisteredPlayersNumFromEmbed } from "src/interactionHandlers/utils";
import { getColumnValueByEventId } from "supabaseDB/methods/teams";
import { Teams } from "utils/dbTypes";
import { logFormattedError } from "utils/logging/logError";
import { TEAM_FIELD_NAMES } from "../../../utils/constants";
import { createTeamEmbed, TeamEmbedType } from "../../../utils/embeds";
import { findEmbedField } from "../../../utils/utils";

interface updateAllTeamInfo {
  eventId: number;
  interaction: ModalSubmitInteraction;
  changed?: {
    eventDateTime?: string;
    eventName?: string;
    maxNumTeamPlayers?: string;
  };
}

const updateAllTeamInfo = async ({ eventId, interaction, changed }: updateAllTeamInfo) => {
  try {
    const values = (await getColumnValueByEventId({
      eventId: eventId,
      columnName: "*",
    })) as unknown as Teams[];

    for (const value of values) {
      const fetchedMessage = await interaction.channel?.messages.fetch(value.messageId);

      if (fetchedMessage) {
        const registeredPlayers = findEmbedField(
          fetchedMessage.embeds[0].fields,
          TEAM_FIELD_NAMES.registeredPlayers,
          true,
        );

        const registeredPlayersLength = getRegisteredPlayersNumFromEmbed(registeredPlayers?.name);

        const eventDateTime = findEmbedField(
          fetchedMessage.embeds[0].fields,
          TEAM_FIELD_NAMES.dateTime,
        );

        const eventName = findEmbedField(
          fetchedMessage.embeds[0].fields,
          TEAM_FIELD_NAMES.eventName,
        );

        const embedObj: TeamEmbedType = {
          eventId: eventId.toString(),
          teamId: value.id.toString(),
          teamLeader: interaction.user.username,
          teamName: value.name,
          eventName: changed?.eventName ? changed.eventName : eventName, // ? changeable
          description: value.description,
          eventDateTime: changed?.eventDateTime ? changed.eventDateTime : eventDateTime, // ? changeable
        };

        if (changed?.maxNumTeamPlayers && changed.maxNumTeamPlayers.length > 0) {
          embedObj.teamPlayers = {
            registered: registeredPlayersLength.toString(),
            max: changed?.maxNumTeamPlayers,
          };
          embedObj.replaceRegisteredPlayers = {
            value: registeredPlayers?.value,
          };
        } else {
          embedObj.replaceRegisteredPlayers = {
            name: registeredPlayers?.name,
            value: registeredPlayers?.value,
          };
        }

        const editedEmbed = createTeamEmbed(embedObj);

        await fetchedMessage.edit({
          embeds: [editedEmbed],
        });
      }
    }
  } catch (err) {
    logFormattedError(err);
  }
};

export default updateAllTeamInfo;
