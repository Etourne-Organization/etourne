import { ButtonInteraction, Client } from "discord.js";

import { findFooterEventId } from "src/interactionHandlers/utils";
import { getAllColumnValueById } from "supabaseDB/methods/events";
import { getUserRole } from "supabaseDB/methods/users";
import getMessageEmbed from "utils/getMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../type";
import { createUnauthorizedRoleEmbed } from "../../utils/embeds";
import { createEditTeamCreatorEventComponents } from "../../utils/modalComponents";

const editTeamEventInfo: ButtonFunction = {
  customId: "editTeamEventInfo",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      // check user role in DB
      const userRoleDB = await getUserRole({
        discordUserId: interaction.user.id,
        discordServerId: interaction.guild!.id,
      });

      if (
        userRoleDB.length > 0 &&
        (userRoleDB[0]["roleId"] === 2 || userRoleDB[0]["roleId"] === 3)
      ) {
        const unauthorizedRoleEmbed = createUnauthorizedRoleEmbed();
        return interactionHandler.embeds(unauthorizedRoleEmbed).reply();
      }

      const eventId = findFooterEventId(embed.footer);

      const allColumnValue = await getAllColumnValueById({ id: parseInt(eventId) });

      const modal = createEditTeamCreatorEventComponents({
        description: allColumnValue[0].description,
        eventName: allColumnValue[0].eventName,
        gameName: allColumnValue[0].gameName,
        interactionId: interaction.id,
        timezone: allColumnValue[0].timezone,
      });

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

export default editTeamEventInfo;
