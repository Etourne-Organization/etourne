import { Client, ModalSubmitInteraction } from "discord.js";

import { addEvent, setColumnValue } from "supabaseDB/methods/events";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ModalSubmit } from "../../type";
import { createNormalCreatorButtonComponents } from "../../utils/btnComponents";
import { createNormalCreatorEmbed } from "../../utils/embeds";
import { inputToTimezone } from "../../utils/utils";

const normalEventModal: ModalSubmit = {
  customId: "normalEventModalSubmit",
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

      const id = await addEvent({
        eventName,
        gameName,
        description,
        dateTime: inputToTimezone(eventDateTime, timezone, true),
        isTeamEvent: false,
        discordServerId: interaction.guild.id,
        timezone,
        eventHost: interaction.user.username,
        channelId: interaction.channel!.id,
        discordServerName: interaction.guild.name,
      });

      const eventEmbed = createNormalCreatorEmbed({
        eventName,
        description,
        eventDateTime: inputToTimezone(eventDateTime, timezone),
        eventId: id,
        eventHost: interaction.user.username,
        gameName,
      });

      const messageComponents = createNormalCreatorButtonComponents();

      const reply = await interaction.channel?.send({
        embeds: [eventEmbed],
        components: messageComponents,
      });

      await setColumnValue({
        data: [
          {
            id: id,
            key: "messageId",
            value: reply!.id,
          },
        ],
      });

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
