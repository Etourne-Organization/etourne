import { ButtonInteraction, Client } from "discord.js";

import {
  collectorFilter,
  createConfirmationBtns,
  getButtonIds,
} from "src/interactionHandlers/selectMenuHandler/utils/btnComponents";
import { findFooterEventId } from "src/interactionHandlers/utils";
import { deleteEvent as deleteEventSupabase } from "supabaseDB/methods/events";
import { getUserRole } from "supabaseDB/methods/users";
import getMessageEmbed from "utils/getMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../type";
import {
  createDeleteEventConfirmationEmbed,
  createUnauthorizedRoleEmbed,
} from "../../utils/embeds";

const deleteEvent: ButtonFunction = {
  customId: "deleteEvent",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interactionHandler.processing();

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const eventId = findFooterEventId(embed.footer);

      const buttonAlias = interaction.id;

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
        return interactionHandler.embeds(unauthorizedRoleEmbed).reply();
      }

      const fetchedMessage = await interaction.channel?.messages.fetch(interaction.message.id);

      if (fetchedMessage) {
        const confirmationButtons = createConfirmationBtns(buttonAlias);

        const removeEventConfirmationEmbed = createDeleteEventConfirmationEmbed();

        await interactionHandler.embeds(removeEventConfirmationEmbed).editReply({
          components: [confirmationButtons],
        });

        const filter = (btnInteraction: ButtonInteraction | unknown) =>
          collectorFilter(btnInteraction, interaction.user.id, buttonAlias);

        const collector = interaction.channel?.createMessageComponentCollector({
          filter,
          time: 15000,
          // max: 1,
          // maxComponents: 1,
        });

        collector?.on("collect", async (btnInteraction: ButtonInteraction) => {
          const btnInteractionHandler = new InteractionHandler(btnInteraction);
          const { deleteYesId, deleteNoId } = getButtonIds(buttonAlias);

          if (btnInteraction.customId === deleteYesId) {
            await fetchedMessage.delete();

            btnInteractionHandler.processing();

            await deleteEventSupabase({ eventId: parseInt(eventId) });

            await interaction.deleteReply();

            await btnInteractionHandler
              .embeds(new CustomMessageEmbed().setTitle("Event deleted successfully!").Success)
              .editReply();
          } else if (btnInteraction.customId === deleteNoId) {
            await interaction.deleteReply();

            await btnInteractionHandler
              .embeds(new CustomMessageEmbed().setTitle("Event not deleted").Info)
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
          .editReply(),
      );
    }
  },
};

export default deleteEvent;
