import { ModalSubmitInteraction } from "discord.js";

import { findEmbedField, getRegisteredPlayersNumFromEmbed } from "src/interactionHandlers/utils";
import { getTeamColumnDB } from "supabaseDB/methods/columns";
import { logFormattedError } from "utils/logging/logError";
import { TEAM_FIELD_NAMES } from "../../../utils/constants";
import { createTeamEmbed, TeamEmbedType } from "../../../utils/embeds";

interface updateRelatedTeamModalsTypes {
  eventId: number;
  interaction: ModalSubmitInteraction;
  changed?: {
    eventDateTime?: string;
    eventName?: string;
    maxNumTeamPlayers?: string;
  };
}

const updateRelatedTeamModals = async ({
  eventId,
  interaction,
  changed,
}: updateRelatedTeamModalsTypes) => {
  try {
    const teamObjs = await getTeamColumnDB(
      eventId,
      ["id", "name", "description", "messageId"],
      true,
      true,
    );

    for (const value of teamObjs) {
      const fetchedMessage = await interaction.channel?.messages.fetch(value.messageId || "");

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
          eventId,
          teamId: value.id!,
          teamLeader: interaction.user.username,
          teamName: value.name || "",
          description: value.description || "",
          eventName: changed?.eventName ? changed.eventName : eventName, // ? changeable
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

export default updateRelatedTeamModals;
