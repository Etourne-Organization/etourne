import { ButtonInteraction, Client } from "discord.js";

import { findFooterEventId } from "src/interactionHandlers/utils";
import {
  collectorFilter,
  createConfirmationBtns,
} from "src/interactionHandlers/selectMenuHandler/utils/btnComponents";
import { validateServerExists, validateUserPermission } from "src/interactionHandlers/validate";
import { deleteEventDB } from "supabaseDB/methods/events";
import getMessageEmbed from "utils/interactions/getInteractionEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../type";
import { createDeleteEventConfirmationEmbed } from "../../utils/embeds";
import { NORMAL_CREATOR_EVENT_TEXT_FIELD } from "../../utils/constants";

const deleteEvent: ButtonFunction = {
  customId: NORMAL_CREATOR_EVENT_TEXT_FIELD.DELETE_EVENT,
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interactionHandler.processing();

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const eventId = findFooterEventId(embed.footer);

      const buttonAlias = interaction.id;

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

      const fetchedMessage = await interaction.channel?.messages.fetch(interaction.message.id);

      if (fetchedMessage) {
        const { confirmationButtons, deleteNoId, deleteYesId } =
          createConfirmationBtns(buttonAlias);

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
          try {
            const btnInteractionHandler = new InteractionHandler(btnInteraction);

            if (btnInteraction.customId === deleteYesId) {
              await fetchedMessage.delete();

              btnInteractionHandler.processing();

              await deleteEventDB(eventId);

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
          } catch (error) {
            await handleAsyncError(error, () =>
              interactionHandler
                .embeds(
                  new CustomMessageEmbed().defaultErrorTitle().defaultErrorDescription().Error,
                )
                .editReply(),
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
          .editReply(),
      );
    }
  },
};

export default deleteEvent;
