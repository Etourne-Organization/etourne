import { ButtonInteraction, Client } from "discord.js";

import { TEAM_FIELD_NAMES } from "src/interactionHandlers/modalSubmitHandler/utils/constants";
import { findEmbedField } from "src/interactionHandlers/modalSubmitHandler/utils/utils";
import { findFooterTeamId } from "src/interactionHandlers/utils";
import { getAllTeamPlayers } from "supabaseDB/methods/teamPlayers";
import { checkTeamExists } from "supabaseDB/methods/teams";
import { getUserRole } from "supabaseDB/methods/users";
import getMessageEmbed from "utils/getMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../type";
import {
  createMissingTeamEmbed,
  createNoPlayersToRemoveEmbed,
  createUnauthorizedRoleEmbed,
} from "../../utils/embeds";
import { createTeamRemovePlayerComponents } from "../../utils/selectComponents";

const removeTeamPlayer: ButtonFunction = {
  customId: "removeTeamPlayer",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interactionHandler.processing();

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const teamId = findFooterTeamId(embed.footer);

      if (!(await checkTeamExists({ teamId: parseInt(teamId) }))) {
        const missingTeamEmbed = createMissingTeamEmbed();
        return interactionHandler.embeds(missingTeamEmbed).editReply();
      }

      const teamLeader = findEmbedField(embed.fields, TEAM_FIELD_NAMES.teamLeader);

      // check user role in DB
      const userRoleDB = await getUserRole({
        discordUserId: interaction.user.id,
        discordServerId: interaction.guild!.id,
      });

      // Check if the user is the team leader or has an authorized role (e.g., admin or mod)
      if (
        interaction.user.username === teamLeader ||
        (userRoleDB.length > 0 && (userRoleDB[0]["roleId"] === 2 || userRoleDB[0]["roleId"] === 3))
      ) {
        const unauthorizedRoleEmbed = createUnauthorizedRoleEmbed();
        return interactionHandler.embeds(unauthorizedRoleEmbed).editReply();
      }

      const teamPlayers = await getAllTeamPlayers(parseInt(teamId));

      if (teamPlayers.length === 0) {
        const noPlayersEmbed = createNoPlayersToRemoveEmbed();
        return interactionHandler.embeds(noPlayersEmbed).editReply();
      }

      const { selectMenu, selectMessageEmbed } = createTeamRemovePlayerComponents(
        teamPlayers,
        embed.footer!.text,
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

export default removeTeamPlayer;
