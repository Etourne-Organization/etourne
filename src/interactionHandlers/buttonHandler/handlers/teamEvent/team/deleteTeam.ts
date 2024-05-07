import { ButtonInteraction, Client } from "discord.js";

import { findFooterTeamId } from "src/interactionHandlers/utils";
import { TEAM_FIELD_NAMES } from "src/interactionHandlers/modalSubmitHandler/utils/constants";
import { findEmbedField } from "src/interactionHandlers/utils";
import {
  collectorFilter,
  createConfirmationBtns,
} from "src/interactionHandlers/selectMenuHandler/utils/btnComponents";
import {
  validateServerExists,
  validateTeamExists,
  validateUserPermission,
} from "src/interactionHandlers/validate";
import { deleteTeamDB } from "supabaseDB/methods/players";
import getMessageEmbed from "utils/interactions/getInteractionEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../../type";
import { createDeleteTeamConfirmationEmbed } from "../../../utils/embeds";
import { TEAM_EVENT_TEXT_FIELD } from "../../../utils/constants";

const deleteTeam: ButtonFunction = {
  customId: TEAM_EVENT_TEXT_FIELD.DELETE_TEAM,
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      await interactionHandler.processing();

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const teamLeader = findEmbedField(embed.fields, TEAM_FIELD_NAMES.teamLeader);

      const {
        isValid: hasServer,
        embed: notRegisteredEmbed,
        value: serverId,
      } = await validateServerExists(interaction.guildId);
      if (!hasServer) return interactionHandler.embeds(notRegisteredEmbed).editReply();

      if (interaction.user.username !== teamLeader) {
        const { isValid: validPermission, embed: invalidEmbed } = await validateUserPermission(
          serverId,
          interaction.user.id,
        );
        if (!validPermission) return interactionHandler.embeds(invalidEmbed).editReply();
      }

      const teamId = findFooterTeamId(embed.footer);

      const fetchedMessage = await interaction.channel?.messages.fetch(interaction.message.id);

      if (fetchedMessage) {
        const { confirmationButtons, deleteNoId, deleteYesId } = createConfirmationBtns();

        const removeTeamConfirmationEmbed = createDeleteTeamConfirmationEmbed();

        await interactionHandler.embeds(removeTeamConfirmationEmbed).editReply({
          components: [confirmationButtons],
        });

        const filter = (btnInteraction: ButtonInteraction | unknown) =>
          collectorFilter(btnInteraction, interaction.user.id);

        const collector = interaction.channel?.createMessageComponentCollector({
          filter,
          time: 15000,
          max: 1,
          maxComponents: 1,
        });

        collector?.on("collect", async (btnInteraction: ButtonInteraction) => {
          try {
            const btnInteractionHandler = new InteractionHandler(btnInteraction);

            if (btnInteraction.customId === deleteYesId) {
              await fetchedMessage.delete();
              await interaction.deleteReply();

              btnInteractionHandler.processing();

              const { isValid } = await validateTeamExists(teamId);
              if (isValid) await deleteTeamDB(teamId);

              await btnInteractionHandler
                .embeds(new CustomMessageEmbed().setTitle("Team deleted successfully!").Success)
                .editReply();
            } else if (btnInteraction.customId === deleteNoId) {
              await interaction.deleteReply();

              await btnInteractionHandler
                .embeds(new CustomMessageEmbed().setTitle("Team not deleted").Info)
                .reply();
            }
          } catch (error) {
            await handleAsyncError(error, () =>
              interactionHandler
                .embeds(
                  new CustomMessageEmbed().defaultErrorTitle().defaultErrorDescription().Error,
                )
                .reply(),
            );
          }
        });
      } else {
        await interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("Something went wrong").Error)
          .editReply();
      }
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().defaultErrorDescription().Error)
          .reply(),
      );
    }
  },
};

export default deleteTeam;
