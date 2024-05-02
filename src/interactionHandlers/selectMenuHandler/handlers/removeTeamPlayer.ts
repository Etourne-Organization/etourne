import { ButtonInteraction, Client, SelectMenuInteraction } from "discord.js";

import { createRemoveUserConfirmationEmbed } from "src/interactionHandlers/buttonHandler/utils/embeds";
import { TEAM_FIELD_NAMES } from "src/interactionHandlers/modalSubmitHandler/utils/constants";
import { findEmbedField } from "src/interactionHandlers/modalSubmitHandler/utils/utils";
import {
  findFooterTeamId,
  getRegisteredPlayersFromEmbedField,
  updateEmbed,
  updateEmbedField,
} from "src/interactionHandlers/utils";
import { removePlayer } from "supabaseDB/methods/teamPlayers";
import { checkTeamExists, getColumnValueById } from "supabaseDB/methods/teams";
import getMessageEmbed from "utils/getMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import logError, { logFormattedError } from "utils/logging/logError";
import { SelectMenu } from "../type";
import { collectorFilter, createConfirmationBtns, getButtonIds } from "../utils/btnComponents";

const removeTeamPlayer: SelectMenu = {
  customId: "removeTeamPlayer",
  run: async (client: Client, interaction: SelectMenuInteraction) => {
    try {
      const embed = getMessageEmbed(interaction);
      if (!embed) return;

      const username = interaction.values[0].split("||")[0];
      const userId = interaction.values[0].split("||")[1];
      const teamId = findFooterTeamId(embed.footer);

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

          if (await checkTeamExists({ teamId: parseInt(teamId) }))
            await removePlayer({
              discordUserId: userId,
              teamId: parseInt(teamId),
            });

          const messageIdInfo = await getColumnValueById({
            id: parseInt(teamId),
            columnName: "messageId",
          });

          const messageId = messageIdInfo[0]?.messageId || "";

          const fetchedMessage = await interaction.channel?.messages.fetch(messageId);

          if (fetchedMessage) {
            const embed = fetchedMessage.embeds[0];

            const registeredPlayersField = findEmbedField(
              embed.fields,
              TEAM_FIELD_NAMES.registeredPlayers,
            );

            const registeredPlayers = getRegisteredPlayersFromEmbedField(registeredPlayersField);

            const registeredIndex = registeredPlayers.indexOf(username);

            // ? Check if the current user is not registered
            if (registeredIndex === -1) return logError("bruh, what?  - removeTeamPlayer");

            registeredPlayers.splice(registeredIndex, 1);
            const newPlayersList = registeredPlayers.join("\n");

            const numRegisteredPlayers = registeredPlayers.length.toString();

            const fields = updateEmbedField(embed.fields, {
              numRegisteredPlayers,
              registeredList: newPlayersList,
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

export default removeTeamPlayer;
