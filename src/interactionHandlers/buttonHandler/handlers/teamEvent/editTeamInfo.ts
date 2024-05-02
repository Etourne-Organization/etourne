import { ButtonInteraction, Client } from "discord.js";

import { TEAM_FIELD_NAMES } from "src/interactionHandlers/modalSubmitHandler/utils/constants";
import { findEmbedField } from "src/interactionHandlers/modalSubmitHandler/utils/utils";
import { findFooterTeamId } from "src/interactionHandlers/utils";
import { checkTeamExists, getAllColumnValueById } from "supabaseDB/methods/teams";
import { getUserRole } from "supabaseDB/methods/users";
import getMessageEmbed from "utils/getMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../type";
import { createMissingTeamEmbed, createUnauthorizedRoleEmbed } from "../../utils/embeds";
import { createEditTeamEventComponents } from "../../utils/modalComponents";

const editTeamInfo: ButtonFunction = {
  customId: "editTeamInfo",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const teamId = findFooterTeamId(embed.footer);

      if (!(await checkTeamExists({ teamId: parseInt(teamId) }))) {
        const missingTeamEmbed = createMissingTeamEmbed();
        return interactionHandler.embeds(missingTeamEmbed).reply();
      }

      const teamLeader = findEmbedField(embed.fields, TEAM_FIELD_NAMES.teamLeader);

      const userRoleDB = await getUserRole({
        discordUserId: interaction.user.id,
        discordServerId: interaction.guild!.id,
      });

      if (
        interaction.user.username === teamLeader ||
        (userRoleDB.length > 0 && (userRoleDB[0]["roleId"] === 2 || userRoleDB[0]["roleId"] === 3))
      ) {
        const unauthorizedRoleEmbed = createUnauthorizedRoleEmbed();
        return interactionHandler.embeds(unauthorizedRoleEmbed).reply();
      }

      const allColumnValue = await getAllColumnValueById({ id: parseInt(teamId) });

      const modal = createEditTeamEventComponents({
        interactionId: interaction.id,
        name: allColumnValue[0].name,
        description: allColumnValue[0].description,
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

export default editTeamInfo;
