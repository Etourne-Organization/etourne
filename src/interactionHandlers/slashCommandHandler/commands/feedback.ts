import { BaseCommandInteraction, Client } from "discord.js";

import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { Command } from "../type";

const feedback: Command = {
  name: "feedback",
  description: "Send feedback",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      const embed = new CustomMessageEmbed()
        .setTitle(":thought_balloon: Feedback")
        .addFields([
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
        .setTimestamp().Info;

      return interactionHandler.embeds(embed).reply();
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler.embeds(new CustomMessageEmbed().defaultErrorTitle().SHORT.Error).reply(),
      );
    }
  },
};

export default feedback;
