import { Client, ModalSubmitInteraction } from "discord.js";

import { findEmbedField, findFooterEventId, findFooterTeamId } from "src/interactionHandlers/utils";
import { updateTeamDB } from "supabaseDB/methods/players";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import getMessageEmbed from "utils/interactions/getInteractionEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ModalSubmit } from "../../../type";
import { TEAM_FIELD_NAMES } from "../../../utils/constants";
import { createTeamEmbed } from "../../../utils/embeds";
import { TEAM_EVENT_TEXT_FIELD } from "src/interactionHandlers/buttonHandler/utils/constants";

const editTeamInfoModal: ModalSubmit = {
  customId: TEAM_EVENT_TEXT_FIELD.EDIT_TEAM_INFO_MODAL,
  run: async (client: Client, interaction: ModalSubmitInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      if (!interaction.inCachedGuild()) return;

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const teamId = findFooterTeamId(embed.footer);
      const eventId = findFooterEventId(embed.footer);

      const registeredPlayers = findEmbedField(
        embed.fields,
        TEAM_FIELD_NAMES.registeredPlayers,
        true,
      );

      const eventDateTime = findEmbedField(embed.fields, TEAM_FIELD_NAMES.dateTime);

      const eventName = findEmbedField(embed.fields, TEAM_FIELD_NAMES.eventName);

      const teamLeader = findEmbedField(embed.fields, TEAM_FIELD_NAMES.teamLeader);

      const newTeamName = interaction.fields.getTextInputValue("teamName");
      const newTeamShortDescription = interaction.fields.getTextInputValue("teamShortDescription");

      await updateTeamDB(teamId, newTeamName, newTeamShortDescription);

      const editedEmbed = createTeamEmbed({
        description: newTeamShortDescription,
        eventId,
        teamId,
        teamName: newTeamName,
        teamLeader,
        eventDateTime,
        eventName,
        replaceRegisteredPlayers: {
          name: registeredPlayers?.name,
          value: registeredPlayers?.value,
        },
      });

      await interactionHandler.embeds(editedEmbed).editReply();

      return interactionHandler
        .embeds(new CustomMessageEmbed().setTitle("Team info updated successfully!").Success)
        .followUp();
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().defaultErrorDescription().Error)
          .followUp(),
      );
    }
  },
};

export default editTeamInfoModal;
