import { Client, ModalSubmitInteraction } from "discord.js";

import { updateTeam } from "supabaseDB/methods/teams";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ModalSubmit } from "../../../type";
import { TEAM_FIELD_NAMES } from "../../../utils/constants";
import { createTeamEmbed } from "../../../utils/embeds";
import { findEmbedField } from "../../../utils/utils";
import getMessageEmbed from "utils/getMessageEmbed";
import { findFooterEventId, findFooterTeamId } from "src/interactionHandlers/utils";

const editTeamInfoModal: ModalSubmit = {
  customId: "editTeamInfoModal",
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

      const newTeamName: string = interaction.fields.getTextInputValue("teamName");
      const newTeamShortDescription: string =
        interaction.fields.getTextInputValue("teamShortDescription");

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

      await updateTeam({
        id: parseInt(teamId),
        teamName: newTeamName,
        teamDescription: newTeamShortDescription,
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
