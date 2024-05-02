import { Client, ModalSubmitInteraction } from "discord.js";

import { addEvent, setColumnValue } from "supabaseDB/methods/events";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ModalSubmit } from "../../../type";
import { createTeamCreatorEmbed } from "../../../utils/embeds";
import { inputToTimezone } from "../../../utils/utils";
import { createTeamCreatorButtonComponents } from "../../../utils/btnComponents";

const teamEventModal: ModalSubmit = {
  customId: "teamEventModalSubmit",
  run: async (client: Client, interaction: ModalSubmitInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      await interactionHandler.processing("Creating Event...");

      if (!interaction.inCachedGuild()) return;

      const eventName = interaction.fields.getTextInputValue("eventName");
      const gameName = interaction.fields.getTextInputValue("gameName");
      const timezone = interaction.fields.getTextInputValue("timezone");
      const eventDateTime = interaction.fields.getTextInputValue("dateTime");
      const description = interaction.fields.getTextInputValue("eventDescription");

      const eventId = await addEvent({
        eventName: eventName,
        eventHost: interaction.user.username,
        gameName: gameName,
        description: description,
        dateTime: inputToTimezone(eventDateTime, timezone, true),
        isTeamEvent: true,
        discordServerId: interaction.guild.id,
        timezone: timezone,
        channelId: interaction.channel!.id,
        discordServerName: interaction.guild.name,
      });

      const eventEmbed = createTeamCreatorEmbed({
        description,
        eventHost: interaction.user.username,
        eventId,
        eventName,
        gameName,
        eventDateTime: inputToTimezone(eventDateTime, timezone),
      });

      const messageComponents = createTeamCreatorButtonComponents();

      const reply = await interaction.channel?.send({
        embeds: [eventEmbed],
        components: messageComponents,
      });

      await setColumnValue({
        data: [
          {
            id: eventId,
            key: "messageId",
            value: reply!.id,
          },
        ],
      });

      await interactionHandler
        .embeds(new CustomMessageEmbed().setTitle("Team event created successfully!").Success)
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

export default teamEventModal;
