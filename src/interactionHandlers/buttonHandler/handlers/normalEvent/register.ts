import { ButtonInteraction, Client } from "discord.js";

import { addPlayer } from "src/interactionHandlers/create";
import {
  findFooterEventId,
  getRegisteredPlayersFromEmbedField,
  updateEmbed,
  updateEmbedField,
} from "src/interactionHandlers/utils";
import { NORMAL_CREATOR_FIELD_NAMES } from "src/interactionHandlers/modalSubmitHandler/utils/constants";
import { findEmbedField } from "src/interactionHandlers/utils";
import { getTeamEventPlayerCountDB } from "supabaseDB/methods/players";
import { getEventColumnDB } from "supabaseDB/methods/columns";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../type";
import { createAlreadyRegisteredEmbed, createMaxPlayerLimitEmbed } from "../../utils/embeds";
import { NORMAL_CREATOR_EVENT_TEXT_FIELD } from "../../utils/constants";

const register: ButtonFunction = {
  customId: NORMAL_CREATOR_EVENT_TEXT_FIELD.REGISTER_PLAYER,
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      const embed = interaction.message.embeds[0];

      const eventId = findFooterEventId(embed.footer);

      const maxNumPlayers = (await getEventColumnDB(eventId, "maxNumPlayers")) || 0;

      const currentNumPlayers = (await getTeamEventPlayerCountDB(eventId)) || 0;

      if (currentNumPlayers >= maxNumPlayers) {
        const maxLimitEmbed = createMaxPlayerLimitEmbed();
        return interactionHandler.embeds(maxLimitEmbed).followUp();
      }

      const registeredPlayersField = findEmbedField(
        embed.fields,
        NORMAL_CREATOR_FIELD_NAMES.registeredPlayers,
      );

      const registeredPlayers = getRegisteredPlayersFromEmbedField(registeredPlayersField);

      // ? Check if the current user is already registered
      if (registeredPlayers.includes(interaction.user.username)) {
        const alreadyRegisteredEmbed = createAlreadyRegisteredEmbed();
        return interactionHandler.embeds(alreadyRegisteredEmbed).followUp();
      }

      // ? If the user is not registered, add them to the existing list
      const newPlayersList = [...registeredPlayers, interaction.user.username];

      const numRegisteredPlayers = newPlayersList.length;

      const fields = updateEmbedField(embed.fields!, {
        numRegisteredPlayers: numRegisteredPlayers.toString(),
        registeredList: newPlayersList.join("\n"),
      });

      await addPlayer({
        username: interaction.user.username,
        userId: interaction.user.id,
        eventId,
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
        .embeds(new CustomMessageEmbed().setTitle("Registered successfully!").Success)
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

export default register;
