import { Client, ModalSubmitInteraction } from "discord.js";

import { findFooterEventId, updateEmbed, updateEmbedField } from "src/interactionHandlers/utils";
import { setColumnValue } from "supabaseDB/methods/events";
import getMessageEmbed from "utils/getMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ModalSubmit } from "../../type";

const setMaxNumPlayersModal: ModalSubmit = {
  customId: "maxNumPlayersModalSubmit",
  run: async (client: Client, interaction: ModalSubmitInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const eventId = findFooterEventId(embed.footer);

      const newMaxNumPlayers = interaction.fields.getTextInputValue("maxNumPlayersInput");

      setColumnValue({
        data: [
          {
            key: "maxNumPlayers",
            value: parseInt(newMaxNumPlayers),
            id: parseInt(eventId),
          },
        ],
      });

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
