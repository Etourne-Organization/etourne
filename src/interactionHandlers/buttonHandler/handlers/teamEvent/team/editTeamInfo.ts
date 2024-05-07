import { ButtonInteraction, Client } from "discord.js";

import { findFooterTeamId } from "src/interactionHandlers/utils";
import { TEAM_FIELD_NAMES } from "src/interactionHandlers/modalSubmitHandler/utils/constants";
import { findEmbedField } from "src/interactionHandlers/utils";
import {
  validateServerExists,
  validateTeamExists,
  validateUserPermission,
} from "src/interactionHandlers/validate";
import { getTeamColumnDB } from "supabaseDB/methods/columns";
import getMessageEmbed from "utils/interactions/getInteractionEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../../type";
import { createEditTeamEventComponents } from "../../../utils/modalComponents";
import { TEAM_EVENT_TEXT_FIELD } from "../../../utils/constants";

const editTeamInfo: ButtonFunction = {
  customId: TEAM_EVENT_TEXT_FIELD.EDIT_TEAM_INFO,
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const teamId = findFooterTeamId(embed.footer);

      const { isValid, embed: missingTeamEmbed } = await validateTeamExists(teamId);
      if (!isValid) return interactionHandler.embeds(missingTeamEmbed).followUp();

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

      const eventObj = await getTeamColumnDB(teamId, ["name", "description"], false);

      const modal = createEditTeamEventComponents({
        interactionId: interaction.id,
        name: eventObj.name!,
        description: eventObj.description!,
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
