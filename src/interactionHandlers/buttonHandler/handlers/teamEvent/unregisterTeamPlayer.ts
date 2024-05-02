import { ButtonInteraction, Client } from "discord.js";

import { TEAM_FIELD_NAMES } from "src/interactionHandlers/modalSubmitHandler/utils/constants";
import { findEmbedField } from "src/interactionHandlers/modalSubmitHandler/utils/utils";
import {
  findFooterTeamId,
  getRegisteredPlayersFromEmbedField,
  updateEmbed,
  updateEmbedField,
} from "src/interactionHandlers/utils";
import { removePlayer } from "supabaseDB/methods/teamPlayers";
import { checkTeamExists } from "supabaseDB/methods/teams";
import getMessageEmbed from "utils/getMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../type";
import {
  createEmptyRegistrationListEmbed,
  createMissingTeamEmbed,
  createNotRegisteredEmbed,
} from "../../utils/embeds";

const unregisterTeamPlayer: ButtonFunction = {
  customId: "unregisterTeamPlayer",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const teamId = findFooterTeamId(embed.footer);

      if (!(await checkTeamExists({ teamId: parseInt(teamId) }))) {
        const missingTeamEmbed = createMissingTeamEmbed();
        return interactionHandler.embeds(missingTeamEmbed).followUp();
      }

      const registeredPlayersField = findEmbedField(
        embed.fields,
        TEAM_FIELD_NAMES.registeredPlayers,
        true,
      );

      const registeredPlayers = getRegisteredPlayersFromEmbedField(registeredPlayersField?.value);

      if (registeredPlayers.length === 0) {
        const emptyListEmbed = createEmptyRegistrationListEmbed();
        return interactionHandler.embeds(emptyListEmbed).followUp();
      }

      const registeredIndex = registeredPlayers.indexOf(interaction.user.username);

      // ? Check if the current user is not registered
      if (registeredIndex === -1) {
        const notRegisteredEmbed = createNotRegisteredEmbed();
        return interactionHandler.embeds(notRegisteredEmbed).followUp();
      }

      // ? If the user is registered, remove them from the list
      registeredPlayers.splice(registeredIndex, 1);
      const newPlayersList = registeredPlayers.join("\n");

      const numRegisteredPlayers = registeredPlayers.length;

      const fields = updateEmbedField(embed.fields, {
        numRegisteredPlayers: numRegisteredPlayers.toString(),
        registeredList: newPlayersList,
      });

      await removePlayer({
        discordUserId: interaction.user.id,
        teamId: parseInt(teamId),
      });

      const editedEmbed = updateEmbed({
        title: embed.title,
        description: embed.description,
        fields,
        footer: embed.footer,
      });

      await interactionHandler.embeds(editedEmbed).editReply();

      return interactionHandler
        .embeds(new CustomMessageEmbed().setTitle("Unregistered successfully!").Success)
        .followUp();
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().defaultErrorDescription().Error)
          .followUp(),
      );
    }
  },
};

export default unregisterTeamPlayer;
