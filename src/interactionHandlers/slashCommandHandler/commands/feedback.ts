import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import BOT_CONFIGS from "botConfig";
import { Command } from "../type";

const feedback: Command = {
  name: "feedback",
  description: "Send feedback",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      const embed = new MessageEmbed()
        .setColor(BOT_CONFIGS.color.default)
        .setTitle(":thought_balloon: Feedback")
        .setFields([
          {
            name: ":plunger: Report bug",
            value: "https://etourne.canny.io/bugs",
          },
          {
            name: ":pencil: Share feedback or new ideas",
            value: "https://etourne.canny.io/feature-requests",
          },
        ])
        .setFooter({ text: "Etourne" })
        .setTimestamp();

      return interactionHandler.embeds(embed).reply();
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler.embeds(new CustomMessageEmbed().defaultErrorTitle().SHORT.Error).reply(),
      );
    }
  },
};

export default feedback;
