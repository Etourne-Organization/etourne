import { Client, ModalSubmitInteraction } from "discord.js";

import { findEmbedField, findFooterEventId } from "src/interactionHandlers/utils";
import { updateEventDB } from "supabaseDB/methods/events";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import getMessageEmbed from "utils/interactions/getInteractionEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ModalSubmit } from "../../../type";
import { TEAM_CREATOR_FIELD_NAMES } from "../../../utils/constants";
import { createTeamCreatorEmbed } from "../../../utils/embeds";
import { inputToTimezone } from "../../../utils/utils";
import updateRelatedTeamModals from "./updateRelatedModals";
import { TEAM_CREATOR_EVENT_TEXT_FIELD } from "src/interactionHandlers/buttonHandler/utils/constants";

const editTeamEventInfoModal: ModalSubmit = {
  customId: TEAM_CREATOR_EVENT_TEXT_FIELD.EDIT_TEAM_EVENT_INFO_MODAL,
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

      const newEventName = interaction.fields.getTextInputValue("eventName");
      const newGameName = interaction.fields.getTextInputValue("gameName");
      const newDescription = interaction.fields.getTextInputValue("eventDescription");
      const timezone = interaction.fields.getTextInputValue("timezone");
      const newEventDateTime = interaction.fields.getTextInputValue("date");

      await updateEventDB({
        eventId,
        eventName: newEventName,
        gameName: newGameName,
        description: newDescription,
        dateTime: newEventDateTime ? inputToTimezone(newEventDateTime, timezone, true) : null,
        guildId: interaction.guild.id,
        timezone,
        isTeamEvent: true,
      });

      updateRelatedTeamModals({
        eventId,
        interaction,
        changed: {
          eventName: newEventName,
          maxNumTeamPlayers,
          eventDateTime: newEventDateTime
            ? inputToTimezone(newEventDateTime, timezone)
            : eventDateTimeEmbedValue,
        },
      });

      const editedEmbed = createTeamCreatorEmbed({
        description: newDescription,
        eventHost,
        eventId,
        eventName: newEventName,
        gameName: newGameName,
        eventDateTime: newEventDateTime
          ? inputToTimezone(newEventDateTime, timezone)
          : eventDateTimeEmbedValue,
        maxNumTeamPlayers,
        maxNumTeams,
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
