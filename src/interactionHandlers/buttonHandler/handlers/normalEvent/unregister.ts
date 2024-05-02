import { ButtonInteraction, Client } from "discord.js";

import { NORMAL_CREATOR_FIELD_NAMES } from "src/interactionHandlers/modalSubmitHandler/utils/constants";
import { findEmbedField } from "src/interactionHandlers/modalSubmitHandler/utils/utils";
import {
  findFooterEventId,
  getRegisteredPlayersFromEmbedField,
  updateEmbed,
  updateEmbedField,
} from "src/interactionHandlers/utils";
import { removePlayer } from "supabaseDB/methods/singlePlayers";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../type";
import { createEmptyRegistrationListEmbed, createNotRegisteredEmbed } from "../../utils/embeds";

const unregister: ButtonFunction = {
  customId: "normalEventUnregister",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      await interaction.deferUpdate();

      const embed = interaction.message.embeds[0];

      const eventId = findFooterEventId(embed.footer);

      const registeredPlayersField = findEmbedField(
        embed.fields,
        NORMAL_CREATOR_FIELD_NAMES.registeredPlayers,
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
        eventId: parseInt(eventId),
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
          .embeds(
            new CustomMessageEmbed().defaultErrorTitle().SHORT.defaultErrorDescription().SHORT
              .Error,
          )
          .followUp(),
      );
    }
  },
};

export default unregister;
