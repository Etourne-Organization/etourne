import { ButtonInteraction, Client } from "discord.js";

import { findFooterEventId } from "src/interactionHandlers/utils";
import { getColumnValueById } from "supabaseDB/methods/events";
import getMessageEmbed from "utils/getMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../type";
import { createSetMaxNumUsersComponents } from "../../utils/modalComponents";

const setMaxNumPlayers: ButtonFunction = {
  customId: "setMaxNumPlayers",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const eventId = findFooterEventId(embed.footer);

      const maxNumPlayers = await getColumnValueById({
        id: parseInt(eventId),
        columnName: "maxNumPlayers",
      });

      const modal = createSetMaxNumUsersComponents({
        interactionId: interaction.id,
        currentMaxNum: maxNumPlayers[0].maxNumPlayers?.toString(),
      });

      await interaction.showModal(modal);
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().defaultErrorDescription().Error)
          .reply(),
      );
    }
  },
};

export default setMaxNumPlayers;
