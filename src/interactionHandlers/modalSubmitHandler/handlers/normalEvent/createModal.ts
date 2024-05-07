import { Client, ModalSubmitInteraction } from "discord.js";

import { NORMAL_CREATOR_EVENT_TEXT_FIELD } from "src/interactionHandlers/buttonHandler/utils/constants";
import { validateServerExists } from "src/interactionHandlers/validate";
import { updateEventColumnsDB } from "supabaseDB/methods/columns";
import { createEventDB } from "supabaseDB/methods/events";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ModalSubmit } from "../../type";
import { createNormalCreatorButtonComponents } from "../../utils/btnComponents";
import { createNormalCreatorEmbed } from "../../utils/embeds";
import { inputToTimezone } from "../../utils/utils";

const normalEventModal: ModalSubmit = {
  customId: NORMAL_CREATOR_EVENT_TEXT_FIELD.NORMAL_EVENT_MODAL_SUBMIT,
  run: async (client: Client, interaction: ModalSubmitInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interactionHandler.processing("Creating event...");

      if (!interaction.inCachedGuild()) return;

      const eventName = interaction.fields.getTextInputValue("eventName");
      const gameName = interaction.fields.getTextInputValue("gameName");
      const timezone = interaction.fields.getTextInputValue("timezone");
      const eventDateTime = interaction.fields.getTextInputValue("dateTime");
      const description = interaction.fields.getTextInputValue("eventDescription");

      const { isValid, embed, value: serverId } = await validateServerExists(interaction.guildId);
      if (!isValid) return interactionHandler.embeds(embed).editReply();

      const eventId = await createEventDB({
        eventName,
        gameName,
        description,
        dateTime: inputToTimezone(eventDateTime, timezone, true),
        isTeamEvent: false,
        serverId,
        timezone,
        eventHost: interaction.user.username,
        channelId: interaction.channel!.id,
      });

      const eventEmbed = createNormalCreatorEmbed({
        eventName,
        eventId,
        description,
        eventDateTime: inputToTimezone(eventDateTime, timezone),
        eventHost: interaction.user.username,
        gameName,
      });

      const messageComponents = createNormalCreatorButtonComponents();

      // ? messageId from `reply.id` is required in order to fetch the embed later
      // ? e.g. used in removePlayer
      const reply = await interaction.channel?.send({
        embeds: [eventEmbed],
        components: messageComponents,
      });

      if (!reply)
        return interactionHandler
          .embeds(
            new CustomMessageEmbed().setDescription("Failed to get messageId").defaultErrorTitle()
              .SHORT.Error,
          )
          .editReply();

      await updateEventColumnsDB(eventId, [{ key: "messageId", value: reply.id }]);

      await interactionHandler
        .embeds(new CustomMessageEmbed().setTitle("Event created successfully!").Success)
        .editReply();
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().defaultErrorDescription().Error)
          .editReply(),
      );
    }
  },
};

export default normalEventModal;
