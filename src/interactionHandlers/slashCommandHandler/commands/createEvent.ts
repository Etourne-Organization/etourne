import { BaseCommandInteraction, Client } from "discord.js";

import { validateServerExists, validateUserPermission } from "src/interactionHandlers/validate";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { Command } from "../type";
import { createNormalCreatorSelectComponents } from "../utils/selectComponents";

const createEvent: Command = {
  name: "createevent",
  description: "Create event",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      interactionHandler.processing();

      const {
        isValid: hasServer,
        embed: notRegisteredEmbed,
        value: serverId,
      } = await validateServerExists(interaction.guildId);
      if (!hasServer) return interactionHandler.embeds(notRegisteredEmbed).editReply();

      const { isValid, embed } = await validateUserPermission(serverId, interaction.user.id);
      if (!isValid) return interactionHandler.embeds(embed).editReply();

      const selectMenu = createNormalCreatorSelectComponents();

      return interactionHandler
        .embeds(
          new CustomMessageEmbed().setTitle("Select event type you would like to create").Info,
        )
        .editReply({
          components: [selectMenu],
        });
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().defaultErrorDescription().Error)
          .editReply(),
      );
    }
  },
};

export default createEvent;
