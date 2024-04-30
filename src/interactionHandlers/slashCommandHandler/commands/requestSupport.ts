import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import BOT_CONFIGS from "botConfig";
import { Command } from "../type";

const requestSupport: Command = {
  name: "requestsupport",
  description: "Request for support whenever you are facing issues",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      const embed = new MessageEmbed()
        .setColor(BOT_CONFIGS.color.default)
        .setTitle(":tools: Support")
        .setDescription("Join the support server: https://discord.gg/vNe9QVrWNa")
        .setTimestamp();

      return interactionHandler.embeds(embed).reply();
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler.embeds(new CustomMessageEmbed().defaultErrorTitle().Error).reply(),
      );
    }
  },
};

export default requestSupport;
