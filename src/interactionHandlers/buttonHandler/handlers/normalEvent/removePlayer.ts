import { ButtonInteraction, Client } from "discord.js";

import { findFooterEventId } from "src/interactionHandlers/utils";
import { getAllPlayers } from "supabaseDB/methods/singlePlayers";
import { getUserRole } from "supabaseDB/methods/users";
import getMessageEmbed from "utils/getMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../type";
import { createNoPlayersToRemoveEmbed, createUnauthorizedRoleEmbed } from "../../utils/embeds";
import { createNormalRemovePlayerComponents } from "../../utils/selectComponents";

const removePlayer: ButtonFunction = {
  customId: "removePlayer",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interactionHandler.processing();

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      // check user role in DB
      const userRoleDB = await getUserRole({
        discordUserId: interaction.user.id,
        discordServerId: interaction.guild!.id,
      });

      if (
        userRoleDB.length === 0 ||
        (userRoleDB[0]["roleId"] !== 3 && userRoleDB[0]["roleId"] !== 2)
      ) {
        const unauthorizedRoleEmbed = createUnauthorizedRoleEmbed();
        return interactionHandler.embeds(unauthorizedRoleEmbed).editReply();
      }

      const eventId = findFooterEventId(embed.footer);

      const players = await getAllPlayers(parseInt(eventId));

      if (players.length === 0) {
        const noPlayersEmbed = createNoPlayersToRemoveEmbed();
        return interactionHandler.embeds(noPlayersEmbed).editReply();
      }

      const { selectMenu, selectMessageEmbed } = createNormalRemovePlayerComponents(
        players,
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
