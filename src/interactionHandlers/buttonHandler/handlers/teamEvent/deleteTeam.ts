import { ButtonInteraction, Client } from "discord.js";

import { TEAM_FIELD_NAMES } from "src/interactionHandlers/modalSubmitHandler/utils/constants";
import { findEmbedField } from "src/interactionHandlers/modalSubmitHandler/utils/utils";
import {
  collectorFilter,
  createConfirmationBtns,
  getButtonIds,
} from "src/interactionHandlers/selectMenuHandler/utils/btnComponents";
import { findFooterTeamId } from "src/interactionHandlers/utils";
import { checkTeamExists, deleteTeam as deleteTeamSupabase } from "supabaseDB/methods/teams";
import { getUserRole } from "supabaseDB/methods/users";
import getMessageEmbed from "utils/getMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../type";
import { createDeleteTeamConfirmationEmbed, createUnauthorizedRoleEmbed } from "../../utils/embeds";

const deleteTeam: ButtonFunction = {
  customId: "deleteTeam",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      await interactionHandler.processing();

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const teamLeader = findEmbedField(embed.fields, TEAM_FIELD_NAMES.teamLeader);

      const userRoleDB = await getUserRole({
        discordUserId: interaction.user.id,
        discordServerId: interaction.guild!.id,
      });

      if (
        (interaction.user.username !== teamLeader && userRoleDB.length === 0) ||
        (userRoleDB[0]["roleId"] !== 3 && userRoleDB[0]["roleId"] !== 2)
      ) {
        const unauthorizedRoleEmbed = createUnauthorizedRoleEmbed();
        return interactionHandler.embeds(unauthorizedRoleEmbed).editReply();
      }

      const teamId = findFooterTeamId(embed.footer);

      const fetchedMessage = await interaction.channel?.messages.fetch(interaction.message.id);

      if (fetchedMessage) {
        const confirmationButtons = createConfirmationBtns();

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
          const btnInteractionHandler = new InteractionHandler(btnInteraction);
          const { deleteYesId, deleteNoId } = getButtonIds();

          if (btnInteraction.customId === deleteYesId) {
            await fetchedMessage.delete();
            await interaction.deleteReply();

            btnInteractionHandler.processing();

            if (await checkTeamExists({ teamId: parseInt(teamId) }))
              await deleteTeamSupabase({ teamId: parseInt(teamId) });

            await btnInteractionHandler
              .embeds(new CustomMessageEmbed().setTitle("Team deleted successfully!").Success)
              .editReply();
          } else if (btnInteraction.customId === deleteNoId) {
            await interaction.deleteReply();

            await btnInteractionHandler
              .embeds(new CustomMessageEmbed().setTitle("Team not deleted").Info)
              .reply();
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
