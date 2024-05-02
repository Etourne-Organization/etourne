import { BaseCommandInteraction, Client } from "discord.js";

import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { Command } from "../type";
import { createSupportEmbed } from "../utils/embeds";

const requestSupport: Command = {
  name: "requestsupport",
  description: "Request for support whenever you are facing issues",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      const supportEmbed = createSupportEmbed();

      return interactionHandler.embeds(supportEmbed).reply();
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler.embeds(new CustomMessageEmbed().defaultErrorTitle().Error).reply(),
      );
    }
  },
};

export default requestSupport;
