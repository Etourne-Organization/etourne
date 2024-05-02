import { ButtonInteraction, Client, SelectMenuInteraction } from "discord.js";

import { NORMAL_CREATOR_FIELD_NAMES } from "src/interactionHandlers/modalSubmitHandler/utils/constants";
import { findEmbedField } from "src/interactionHandlers/modalSubmitHandler/utils/utils";
import {
  findFooterEventId,
  getRegisteredPlayersFromEmbedField,
  updateEmbed,
  updateEmbedField,
} from "src/interactionHandlers/utils";
import { getColumnValueById } from "supabaseDB/methods/events";
import { removePlayer as removeSupabasePlayer } from "supabaseDB/methods/singlePlayers";
import getMessageEmbed from "utils/getMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import logError, { logFormattedError } from "utils/logging/logError";
import { SelectMenu } from "../type";
import { collectorFilter, createConfirmationBtns, getButtonIds } from "../utils/btnComponents";
import { createRemoveUserConfirmationEmbed } from "src/interactionHandlers/buttonHandler/utils/embeds";

const removePlayer: SelectMenu = {
  customId: "removePlayer",
  run: async (client: Client, interaction: SelectMenuInteraction) => {
    try {
      const embed = getMessageEmbed(interaction);
      if (!embed) return;
      const username = interaction.values[0].split("||")[0];
      const userId = interaction.values[0].split("||")[1];
      const eventId = findFooterEventId(embed.footer);

      const confirmationButtons = createConfirmationBtns();

      const removeUserConfirmationEmbed = createRemoveUserConfirmationEmbed(username);
      await interaction.update({
        embeds: [removeUserConfirmationEmbed],
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
          await interaction.deleteReply();

          await btnInteractionHandler.processing();

          const messageIdInfo = await getColumnValueById({
            id: parseInt(eventId),
            columnName: "messageId",
          });
          const messageId = messageIdInfo[0]?.messageId || "";

          const fetchedMessage = await interaction.channel?.messages.fetch(messageId);

          if (fetchedMessage) {
            const embed = fetchedMessage.embeds[0];

            const registeredPlayersField = findEmbedField(
              embed.fields,
              NORMAL_CREATOR_FIELD_NAMES.registeredPlayers,
            );

            const registeredPlayers = getRegisteredPlayersFromEmbedField(registeredPlayersField);

            const registeredIndex = registeredPlayers.indexOf(username);

            // ? Check if the current user is not registered
            if (registeredIndex === -1) return logError("bruh, what? - removePlayer");

            registeredPlayers.splice(registeredIndex, 1);
            const newPlayersList = registeredPlayers.join("\n");

            const numRegisteredPlayers = registeredPlayers.length.toString();

            const fields = updateEmbedField(embed.fields, {
              numRegisteredPlayers,
              registeredList: newPlayersList,
            });

            await removeSupabasePlayer({
              discordUserId: userId,
              eventId: parseInt(eventId),
            });

            const editedEmbed = updateEmbed({
              title: embed.title,
              description: embed.description,
              fields,
              footer: embed.footer,
            });

            await fetchedMessage.edit({
              embeds: [editedEmbed],
            });
          }
          await btnInteractionHandler
            .embeds(new CustomMessageEmbed().setTitle(`Removed ${username} successfully!`).Success)
            .editReply();
        } else if (btnInteraction.customId === deleteNoId) {
          await interaction.deleteReply();

          await btnInteractionHandler
            .embeds(new CustomMessageEmbed().setTitle(`Player ${username} was not removed`).Error)
            .reply();
        }
      });
    } catch (err) {
      logFormattedError(err);
    }
  },
};

export default removePlayer;
