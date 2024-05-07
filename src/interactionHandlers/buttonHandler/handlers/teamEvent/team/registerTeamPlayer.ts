import { ButtonInteraction, Client } from "discord.js";
import { addTeamPlayer } from "src/interactionHandlers/create";
import { TEAM_FIELD_NAMES } from "src/interactionHandlers/modalSubmitHandler/utils/constants";
import {
  findEmbedField,
  findFooterEventId,
  findFooterTeamId,
  getRegisteredPlayersFromEmbedField,
  updateEmbed,
  updateEmbedField,
} from "src/interactionHandlers/utils";
import { validateTeamExists } from "src/interactionHandlers/validate";
import { getEventColumnDB } from "supabaseDB/methods/columns";
import { getTeamEventPlayerCountDB } from "supabaseDB/methods/players";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import getMessageEmbed from "utils/interactions/getInteractionEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../../type";
import { createAlreadyRegisteredEmbed, createMaxPlayerLimitEmbed } from "../../../utils/embeds";
import { TEAM_EVENT_TEXT_FIELD } from "../../../utils/constants";

const registerTeamPlayer: ButtonFunction = {
  customId: TEAM_EVENT_TEXT_FIELD.REGISTER_TEAM_PLAYER,
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const teamId = findFooterTeamId(embed.footer);
      const eventId = findFooterEventId(embed.footer);

      const maxNumTeamPlayers = (await getEventColumnDB(eventId, "maxNumTeamPlayers")) || 0;

      const { isValid, embed: missingTeamEmbed } = await validateTeamExists(teamId);
      if (!isValid) return interactionHandler.embeds(missingTeamEmbed).followUp();

      const currentNumPlayers = (await getTeamEventPlayerCountDB(teamId)) || 0;

      if (currentNumPlayers >= maxNumTeamPlayers) {
        const maxLimitEmbed = createMaxPlayerLimitEmbed();
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

      await addTeamPlayer({
        username: interaction.user.username,
        userId: interaction.user.id,
        teamId,
        guildId: interaction.guildId,
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
