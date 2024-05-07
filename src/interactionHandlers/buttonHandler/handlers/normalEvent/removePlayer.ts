import { ButtonInteraction, Client } from "discord.js";

import { findFooterEventId } from "src/interactionHandlers/utils";
import { validateServerExists, validateUserPermission } from "src/interactionHandlers/validate";
import { getPlayersDB } from "supabaseDB/methods/players";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import getMessageEmbed from "utils/interactions/getInteractionEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../type";
import { NORMAL_CREATOR_EVENT_TEXT_FIELD } from "../../utils/constants";
import { createNoPlayersToRemoveEmbed } from "../../utils/embeds";
import { createNormalRemovePlayerComponents } from "../../utils/selectComponents";

const removePlayer: ButtonFunction = {
  customId: NORMAL_CREATOR_EVENT_TEXT_FIELD.REMOVE_PLAYER,
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interactionHandler.processing();

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const {
        isValid: hasServer,
        embed: notRegisteredEmbed,
        value: serverId,
      } = await validateServerExists(interaction.guildId);
      if (!hasServer) return interactionHandler.embeds(notRegisteredEmbed).editReply();

      const { isValid: validPermission, embed: invalidEmbed } = await validateUserPermission(
        serverId,
        interaction.user.id,
      );
      if (!validPermission) return interactionHandler.embeds(invalidEmbed).editReply();

      const eventId = findFooterEventId(embed.footer);

      const players = await getPlayersDB(eventId);
      
      if (!players) {
        const noPlayersEmbed = createNoPlayersToRemoveEmbed();
        return interactionHandler.embeds(noPlayersEmbed).editReply();
      }

      const { selectMenu, selectMessageEmbed } = createNormalRemovePlayerComponents(
        players as never,
        embed.footer?.text,
      );

      await interactionHandler.embeds(selectMessageEmbed).editReply({
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

export default removePlayer;
