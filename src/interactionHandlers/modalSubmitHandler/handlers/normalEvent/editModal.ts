import { Client, ModalSubmitInteraction } from "discord.js";

import { findEmbedField, findFooterEventId } from "src/interactionHandlers/utils";
import { updateEventDB } from "supabaseDB/methods/events";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import getMessageEmbed from "utils/interactions/getInteractionEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ModalSubmit } from "../../type";
import { NORMAL_CREATOR_FIELD_NAMES } from "../../utils/constants";
import { createNormalCreatorEmbed } from "../../utils/embeds";
import { inputToTimezone } from "../../utils/utils";
import { NORMAL_CREATOR_EVENT_TEXT_FIELD } from "src/interactionHandlers/buttonHandler/utils/constants";

const editEventInfoModal: ModalSubmit = {
  customId: NORMAL_CREATOR_EVENT_TEXT_FIELD.EDIT_EVENT_INFO_MODAL,
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

      await updateEventDB({
        eventId,
        eventName: newEventName,
        gameName: newGameName,
        description: newDescription,
        dateTime: newEventDateTime ? inputToTimezone(newEventDateTime, timezone, true) : null,
        isTeamEvent: false,
        guildId: interaction.guild.id,
        timezone,
      });

      const editedEmbed = createNormalCreatorEmbed({
        description: newDescription,
        eventDateTime: newEventDateTime
          ? inputToTimezone(newEventDateTime, timezone)
          : eventDateTimeEmbedValue,
        eventId,
        eventName: newEventName,
        gameName: newGameName,
        eventHost,
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
