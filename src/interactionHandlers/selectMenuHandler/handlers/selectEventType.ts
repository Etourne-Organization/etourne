import { Client, SelectMenuInteraction } from "discord.js";

import { logFormattedError } from "utils/logging/logError";
import { SelectMenu } from "../type";
import { createEventTypeModal } from "../utils/modalComponents";

const selectEventType: SelectMenu = {
  customId: "selectEventType",
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
