import { ButtonInteraction, Client } from "discord.js";

import { NORMAL_CREATOR_FIELD_NAMES } from "src/interactionHandlers/modalSubmitHandler/utils/constants";
import { findEmbedField } from "src/interactionHandlers/modalSubmitHandler/utils/utils";
import {
  findFooterEventId,
  getRegisteredPlayersFromEmbedField,
  updateEmbed,
  updateEmbedField,
} from "src/interactionHandlers/utils";
import { getColumnValueById } from "supabaseDB/methods/events";
import { addPlayer, getNumOfPlayers } from "supabaseDB/methods/singlePlayers";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../type";
import { createAlreadyRegisteredEmbed, createMaxLimitEmbed } from "../../utils/embeds";

const register: ButtonFunction = {
  customId: "normalEventRegister",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      const embed = interaction.message.embeds[0];
      const eventId = findFooterEventId(embed.footer);

      const maxNumPlayers = await getColumnValueById({
        id: parseInt(eventId),
        columnName: "maxNumPlayers",
      });

      if (
        maxNumPlayers.length > 0 &&
        (await getNumOfPlayers({ eventId: parseInt(eventId) })) ===
          maxNumPlayers[0]["maxNumPlayers"]
      ) {
        const maxLimitEmbed = createMaxLimitEmbed();
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
        discordUserId: interaction.user.id,
        eventId: parseInt(eventId),
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
