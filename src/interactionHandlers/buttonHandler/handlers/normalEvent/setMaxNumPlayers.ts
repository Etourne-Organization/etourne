import { ButtonInteraction, Client } from "discord.js";

import { findFooterEventId } from "src/interactionHandlers/utils";
import { getEventColumnDB } from "supabaseDB/methods/columns";
import getMessageEmbed from "utils/interactions/getInteractionEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../type";
import { createSetMaxNumUsersComponents } from "../../utils/modalComponents";
import { NORMAL_CREATOR_EVENT_TEXT_FIELD } from "../../utils/constants";

const setMaxNumPlayers: ButtonFunction = {
  customId: NORMAL_CREATOR_EVENT_TEXT_FIELD.SET_MAX_NUM_PLAYERS,
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const eventId = findFooterEventId(embed.footer);

      const maxNumPlayers = await getEventColumnDB(eventId, "maxNumPlayers");

      const modal = createSetMaxNumUsersComponents(interaction.id, maxNumPlayers?.toString());

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
