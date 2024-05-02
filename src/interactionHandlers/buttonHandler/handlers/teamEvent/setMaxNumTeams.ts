import { ButtonInteraction, Client } from "discord.js";
import { findFooterEventId } from "src/interactionHandlers/utils";
import { getColumnValueById } from "supabaseDB/methods/events";
import getMessageEmbed from "utils/getMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../type";
import { createSetMaxNumTeamsComponents } from "../../utils/modalComponents";

const setMaxNumTeams: ButtonFunction = {
  customId: "setMaxNumTeams",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const eventId = findFooterEventId(embed.footer);

      const maxNumTeamsData = await getColumnValueById({
        id: parseInt(eventId),
        columnName: "maxNumTeams",
      });

      const modal = createSetMaxNumTeamsComponents({
        interactionId: interaction.id,
        currentMaxNum: maxNumTeamsData[0].maxNumTeams?.toString(),
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

export default setMaxNumTeams;
