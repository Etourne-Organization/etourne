import { ButtonInteraction, Client } from "discord.js";
import { TEAM_FIELD_NAMES } from "src/interactionHandlers/modalSubmitHandler/utils/constants";
import { findEmbedField } from "src/interactionHandlers/modalSubmitHandler/utils/utils";
import {
  findFooterEventId,
  findFooterTeamId,
  getRegisteredPlayersFromEmbedField,
  updateEmbed,
  updateEmbedField,
} from "src/interactionHandlers/utils";
import { getColumnValueById } from "supabaseDB/methods/events";
import { addPlayer, getNumOfTeamPlayers } from "supabaseDB/methods/teamPlayers";
import { checkTeamExists } from "supabaseDB/methods/teams";
import getMessageEmbed from "utils/getMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../type";
import {
  createAlreadyRegisteredEmbed,
  createMaxLimitEmbed,
  createMissingTeamEmbed,
} from "../../utils/embeds";

const registerTeamPlayer: ButtonFunction = {
  customId: "registerTeamPlayer",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const teamId = findFooterTeamId(embed.footer);
      const eventId = findFooterEventId(embed.footer);

      const maxNumTeamPlayersData = await getColumnValueById({
        id: parseInt(eventId),
        columnName: "maxNumTeamPlayers",
      });

      const maxNumTeamPlayers = maxNumTeamPlayersData[0]?.maxNumTeamPlayers || 0;

      if (!(await checkTeamExists({ teamId: parseInt(teamId) }))) {
        const missingTeamEmbed = createMissingTeamEmbed();
        return interactionHandler.embeds(missingTeamEmbed).followUp();
      }

      const currentNumPlayers = await getNumOfTeamPlayers({ teamId: parseInt(teamId) });
      if (currentNumPlayers >= maxNumTeamPlayers) {
        const maxLimitEmbed = createMaxLimitEmbed();
        return interactionHandler.embeds(maxLimitEmbed).followUp();
      }

      const registeredPlayersField = findEmbedField(
        embed.fields,
        TEAM_FIELD_NAMES.registeredPlayers,
        true,
      );

      const registeredPlayers = getRegisteredPlayersFromEmbedField(registeredPlayersField?.value);

      // ? Check if the current user is already registered
      if (registeredPlayers.includes(interaction.user.username)) {
        const alreadyRegisteredEmbed = createAlreadyRegisteredEmbed();
        return interactionHandler.embeds(alreadyRegisteredEmbed).followUp();
      }

      const newPlayersList = [...registeredPlayers, interaction.user.username];

      const numRegisteredPlayers = newPlayersList.length;

      const fields = updateEmbedField(embed.fields, {
        numRegisteredPlayers: numRegisteredPlayers.toString(),
        registeredList: newPlayersList.join("\n"),
      });

      await addPlayer({
        username: interaction.user.username,
        discordUserId: interaction.user.id,
        teamId: parseInt(teamId),
        discordServerId: interaction.guild!.id,
      });

      const editedEmbed = updateEmbed({
        title: embed.title,
        description: embed.description,
        fields,
        footer: embed.footer,
      });

      await interactionHandler.embeds(editedEmbed).editReply();

      return interactionHandler
        .embeds(editedEmbed, new CustomMessageEmbed().setTitle("Registered successfully!").Success)
        .followUp();
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(
            new CustomMessageEmbed().defaultErrorTitle().SHORT.defaultErrorDescription().SHORT
              .Error,
          )
          .followUp(),
      );
    }
  },
};

export default registerTeamPlayer;
