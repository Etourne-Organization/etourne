import { Client, SelectMenuInteraction } from "discord.js";

import { NORMAL_CREATOR_EVENT_TEXT_FIELD } from "src/interactionHandlers/buttonHandler/utils/constants";
import { logFormattedError } from "utils/logging/logError";
import { SelectMenu } from "../type";
import { createEventTypeModal } from "../utils/modalComponents";

const selectEventType: SelectMenu = {
  customId: NORMAL_CREATOR_EVENT_TEXT_FIELD.SELECT_EVENT_TYPE,
  run: async (client: Client, interaction: SelectMenuInteraction) => {
    try {
      const eventType = interaction.values[0];

      const modal = createEventTypeModal(eventType, interaction.id);

      await interaction.showModal(modal);
    } catch (err) {
      logFormattedError(err);
    }
  },
};

export default selectEventType;
