import { ButtonInteraction, Client, SelectMenuInteraction } from "discord.js";

import { createRemoveUserConfirmationEmbed } from "src/interactionHandlers/buttonHandler/utils/embeds";
import { TEAM_FIELD_NAMES } from "src/interactionHandlers/modalSubmitHandler/utils/constants";
import { findEmbedField } from "src/interactionHandlers/utils";
import {
  findFooterTeamId,
  getRegisteredPlayersFromEmbedField,
  updateEmbed,
  updateEmbedField,
} from "src/interactionHandlers/utils";
import { validateTeamExists } from "src/interactionHandlers/validate";
import { getTeamColumnDB } from "supabaseDB/methods/columns";
import { removeTeamPlayerDB } from "supabaseDB/methods/players";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import getMessageEmbed from "utils/interactions/getInteractionEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import logError, { logFormattedError } from "utils/logging/logError";
import { SelectMenu } from "../type";
import { collectorFilter, createConfirmationBtns } from "../utils/btnComponents";
import { TEAM_EVENT_TEXT_FIELD } from "src/interactionHandlers/buttonHandler/utils/constants";

const removeTeamPlayer: SelectMenu = {
  customId: TEAM_EVENT_TEXT_FIELD.REMOVE_TEAM_PLAYER,
  run: async (client: Client, interaction: SelectMenuInteraction) => {
    try {
      const embed = getMessageEmbed(interaction);
      if (!embed) return;

      const username = interaction.values[0].split("||")[0];
      const userIdPK = interaction.values[0].split("||")[1];
      const teamId = findFooterTeamId(embed.footer);

      const { confirmationButtons, deleteYesId, deleteNoId } = createConfirmationBtns();

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
        try {
          const btnInteractionHandler = new InteractionHandler(btnInteraction);

          if (btnInteraction.customId === deleteYesId) {
            await interaction.deleteReply();

            await btnInteractionHandler.processing();

            const { isValid } = await validateTeamExists(teamId);
            if (isValid) await removeTeamPlayerDB(interaction.guildId, userIdPK, teamId);

            const messageId = (await getTeamColumnDB(teamId, "messageId")) || "";

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
              .embeds(
                new CustomMessageEmbed().setTitle(`Removed ${username} successfully!`).Success,
              )
              .editReply();
          } else if (btnInteraction.customId === deleteNoId) {
            await interaction.deleteReply();

            await btnInteractionHandler
              .embeds(new CustomMessageEmbed().setTitle(`Player ${username} was not removed`).Error)
              .reply();
          }
        } catch (error) {
          logFormattedError(error);
        }
      });
    } catch (err) {
      logFormattedError(err);
    }
  },
};

export default removeTeamPlayer;
