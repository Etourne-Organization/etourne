import { Client, ModalSubmitInteraction } from "discord.js";

import { findFooterEventId, updateEmbed, updateEmbedField } from "src/interactionHandlers/utils";
import { updateEventColumnsDB } from "supabaseDB/methods/columns";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import getMessageEmbed from "utils/interactions/getInteractionEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ModalSubmit } from "../../../type";
import updateRelatedTeamModals from "./updateRelatedModals";
import { TEAM_CREATOR_EVENT_TEXT_FIELD } from "src/interactionHandlers/buttonHandler/utils/constants";

const setMaxNumTeamPlayersModal: ModalSubmit = {
  customId: TEAM_CREATOR_EVENT_TEXT_FIELD.SET_MAX_NUM_TEAM_PLAYERS_MODAL_SUBMIT,
  run: async (client: Client, interaction: ModalSubmitInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const eventId = findFooterEventId(embed?.footer);

      const newMaxNumTeamPlayers = interaction.fields.getTextInputValue("maxNumTeamPlayers");

      await updateEventColumnsDB(eventId, [
        { key: "maxNumTeamPlayers", value: parseInt(newMaxNumTeamPlayers) },
      ]);

      const fields = updateEmbedField(embed.fields, {
        maxNumTeamPlayers: newMaxNumTeamPlayers,
      });

      const editedEmbed = updateEmbed({
        title: embed.title,
        description: embed.description,
        fields,
        footer: embed.footer,
      });

      updateRelatedTeamModals({
        eventId,
        interaction,
        changed: {
          maxNumTeamPlayers: newMaxNumTeamPlayers,
        },
      });

      await interactionHandler.embeds(editedEmbed).editReply();

      return interactionHandler
        .embeds(
          new CustomMessageEmbed().setTitle("Max num of team players set successfully!").Success,
        )
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

export default setMaxNumTeamPlayersModal;
