import { ButtonInteraction, Client } from "discord.js";

import { findFooterTeamId } from "src/interactionHandlers/utils";
import { TEAM_FIELD_NAMES } from "src/interactionHandlers/modalSubmitHandler/utils/constants";
import { findEmbedField } from "src/interactionHandlers/utils";
import {
  validateServerExists,
  validateTeamExists,
  validateUserPermission,
} from "src/interactionHandlers/validate";
import { getTeamPlayersDB } from "supabaseDB/methods/players";
import getMessageEmbed from "utils/interactions/getInteractionEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../../type";
import { createNoPlayersToRemoveEmbed } from "../../../utils/embeds";
import { createTeamRemovePlayerComponents } from "../../../utils/selectComponents";
import { TEAM_EVENT_TEXT_FIELD } from "../../../utils/constants";

const removeTeamPlayer: ButtonFunction = {
  customId: TEAM_EVENT_TEXT_FIELD.REMOVE_TEAM_PLAYER,
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interactionHandler.processing();

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const teamId = findFooterTeamId(embed.footer);

      const { isValid, embed: missingTeamEmbed } = await validateTeamExists(teamId);
      if (!isValid) return interactionHandler.embeds(missingTeamEmbed).editReply();

      const {
        isValid: hasServer,
        embed: notRegisteredEmbed,
        value: serverId,
      } = await validateServerExists(interaction.guildId);
      if (!hasServer) return interactionHandler.embeds(notRegisteredEmbed).editReply();

      const teamLeader = findEmbedField(embed.fields, TEAM_FIELD_NAMES.teamLeader);

      if (interaction.user.username !== teamLeader) {
        const { isValid: validPermission, embed: invalidEmbed } = await validateUserPermission(
          serverId,
          interaction.user.id,
        );
        if (!validPermission) return interactionHandler.embeds(invalidEmbed).editReply();
      }

      const teamPlayers = await getTeamPlayersDB(teamId);

      if (!teamPlayers) {
        const noPlayersEmbed = createNoPlayersToRemoveEmbed();
        return interactionHandler.embeds(noPlayersEmbed).editReply();
      }

      const { selectMenu, selectMessageEmbed } = createTeamRemovePlayerComponents(
        teamPlayers as never,
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
