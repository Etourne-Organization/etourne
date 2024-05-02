import { Client, ModalSubmitInteraction } from "discord.js";

import { findFooterEventId } from "src/interactionHandlers/utils";
import { updateEvent } from "supabaseDB/methods/events";
import getMessageEmbed from "utils/getMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ModalSubmit } from "../../type";
import { NORMAL_CREATOR_FIELD_NAMES } from "../../utils/constants";
import { createNormalCreatorEmbed } from "../../utils/embeds";
import { findEmbedField, inputToTimezone } from "../../utils/utils";

const editEventInfoModal: ModalSubmit = {
  customId: "editEventInfoModal",
  run: async (client: Client, interaction: ModalSubmitInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      if (!interaction.inCachedGuild()) return;

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const eventId = findFooterEventId(embed.footer);

      const registeredPlayers = findEmbedField(
        embed.fields,
        NORMAL_CREATOR_FIELD_NAMES.registeredPlayers,
        true,
      );

      const eventDateTimeEmbedValue = findEmbedField(
        embed.fields,
        NORMAL_CREATOR_FIELD_NAMES.dateTime,
      );

      const eventHost = findEmbedField(embed.fields, NORMAL_CREATOR_FIELD_NAMES.hostedBy);

      const newEventName = interaction.fields.getTextInputValue("eventName");
      const newGameName = interaction.fields.getTextInputValue("gameName");
      const timezone = interaction.fields.getTextInputValue("timezone");
      const newEventDateTime = interaction.fields.getTextInputValue("date");
      const newDescription = interaction.fields.getTextInputValue("eventDescription");

      await updateEvent({
        eventId: parseInt(eventId),
        eventName: newEventName,
        gameName: newGameName,
        description: newDescription,
        dateTime: newEventDateTime ? inputToTimezone(newEventDateTime, timezone, true) : null,
        isTeamEvent: false,
        discordServerId: interaction.guild.id,
        timezone: timezone,
      });

      const editedEmbed = createNormalCreatorEmbed({
        description: newDescription,
        eventDateTime: newEventDateTime
          ? inputToTimezone(newEventDateTime, timezone)
          : eventDateTimeEmbedValue,
        eventId,
        eventName: newEventName,
        gameName: newGameName,
        eventHost: eventHost,
        replaceRegisteredPlayers: {
          name: registeredPlayers?.name,
          value: registeredPlayers?.value,
        },
      });

      await interactionHandler.embeds(editedEmbed).editReply();

      return interactionHandler
        .embeds(new CustomMessageEmbed().setTitle("Event updated successfully!").Success)
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

export default editEventInfoModal;
