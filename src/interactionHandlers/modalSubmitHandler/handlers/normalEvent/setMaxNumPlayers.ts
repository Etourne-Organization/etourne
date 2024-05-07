import { Client, ModalSubmitInteraction } from "discord.js";

import { findFooterEventId, updateEmbed, updateEmbedField } from "src/interactionHandlers/utils";
import { updateEventColumnsDB } from "supabaseDB/methods/columns";
import getMessageEmbed from "utils/interactions/getInteractionEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ModalSubmit } from "../../type";
import { NORMAL_CREATOR_EVENT_TEXT_FIELD } from "src/interactionHandlers/buttonHandler/utils/constants";

const setMaxNumPlayersModal: ModalSubmit = {
  customId: NORMAL_CREATOR_EVENT_TEXT_FIELD.MAX_NUM_PLAYERS_MODAL_SUBMIT,
  run: async (client: Client, interaction: ModalSubmitInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const eventId = findFooterEventId(embed.footer);

      const newMaxNumPlayers = interaction.fields.getTextInputValue("maxNumPlayersInput");

      await updateEventColumnsDB(eventId, [
        { key: "maxNumPlayers", value: parseInt(newMaxNumPlayers) },
      ]);

      const fields = updateEmbedField(embed.fields, {
        numMaxPlayers: newMaxNumPlayers,
      });

      const editedEmbed = updateEmbed({
        title: embed.title,
        description: embed.description,
        fields,
        footer: embed.footer,
      });

      await interactionHandler.embeds(editedEmbed).editReply();

      return interactionHandler
        .embeds(new CustomMessageEmbed().setTitle("Max num of players set successfully!").Success)
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

export default setMaxNumPlayersModal;
