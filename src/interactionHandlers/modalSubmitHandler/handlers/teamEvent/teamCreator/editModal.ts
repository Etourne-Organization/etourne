import { Client, ModalSubmitInteraction } from "discord.js";

import { findFooterEventId } from "src/interactionHandlers/utils";
import { updateEvent } from "supabaseDB/methods/events";
import getMessageEmbed from "utils/getMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ModalSubmit } from "../../../type";
import { TEAM_CREATOR_FIELD_NAMES } from "../../../utils/constants";
import { createTeamCreatorEmbed } from "../../../utils/embeds";
import { findEmbedField, inputToTimezone } from "../../../utils/utils";
import updateAllTeamInfo from "./updateRelatedModals";

const editTeamEventInfoModal: ModalSubmit = {
  customId: "editTeamEventInfoModal",
  run: async (client: Client, interaction: ModalSubmitInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      if (!interaction.inCachedGuild()) return;

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const eventId = findFooterEventId(embed?.footer);

      const maxNumTeams = findEmbedField(embed?.fields, TEAM_CREATOR_FIELD_NAMES.maxNumOfTeams);

      const maxNumTeamPlayers = findEmbedField(
        embed?.fields,
        TEAM_CREATOR_FIELD_NAMES.maxNumOfTeamPlayers,
      );
      const eventHost = findEmbedField(embed?.fields, TEAM_CREATOR_FIELD_NAMES.hostedBy);

      const eventDateTimeEmbedValue = findEmbedField(
        embed?.fields,
        TEAM_CREATOR_FIELD_NAMES.dateTime,
      );

      const eventNameInput = interaction.fields.getTextInputValue("eventName");
      const gameNameInput = interaction.fields.getTextInputValue("gameName");
      const timezone = interaction.fields.getTextInputValue("timezone");
      const eventDateTimeInput = interaction.fields.getTextInputValue("date");
      const descriptionInput = interaction.fields.getTextInputValue("eventDescription");

      const editedEmbed = createTeamCreatorEmbed({
        description: descriptionInput,
        eventHost,
        eventId,
        eventName: eventNameInput,
        gameName: gameNameInput,
        eventDateTime: eventDateTimeInput
          ? inputToTimezone(eventDateTimeInput, timezone)
          : eventDateTimeEmbedValue,
        maxNumTeamPlayers,
        maxNumTeams,
      });

      await updateEvent({
        eventId: parseInt(eventId),
        eventName: eventNameInput,
        gameName: gameNameInput,
        description: descriptionInput,
        dateTime: eventDateTimeInput ? inputToTimezone(eventDateTimeInput, timezone, true) : null,
        isTeamEvent: false,
        discordServerId: interaction.guild.id,
        timezone: timezone,
      });

      updateAllTeamInfo({
        eventId: parseInt(eventId),
        interaction: interaction,
        changed: {
          eventName: eventNameInput,
          maxNumTeamPlayers,
          eventDateTime: eventDateTimeInput
            ? inputToTimezone(eventDateTimeInput, timezone)
            : eventDateTimeEmbedValue,
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

export default editTeamEventInfoModal;
