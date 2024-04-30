import {
  Client,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  ModalSubmitInteraction,
} from "discord.js";
import moment from "moment-timezone";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import BOT_CONFIGS from "botConfig";
import { addEvent, setColumnValue } from "supabaseDB/methods/events";
import { getTimzeonValueFromLabel, isoParsingDateFormat, isoTimeFormat } from "utils/timezone/timezone";
import { ModalSubmit } from "../../type";

const teamEventModal: ModalSubmit = {
  customId: "teamEventModalSubmit",
  run: async (client: Client, interaction: ModalSubmitInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      await interactionHandler.processing("Creating Event...");

      const eventName = interaction.fields.getTextInputValue("eventName");
      const gameName = interaction.fields.getTextInputValue("gameName");
      const timezone = interaction.fields.getTextInputValue("timezone");
      const eventDateTime = interaction.fields.getTextInputValue("dateTime");
      const description = interaction.fields.getTextInputValue("eventDescription");

      const eventEmbed = new MessageEmbed()
        .setColor(BOT_CONFIGS.color.default)
        .setTitle(eventName)
        .setDescription(
          `**----------------------------------------** \n **Event description:** \n \n >>> ${description}  \n \n`,
        )
        .addFields([
          {
            name: "Event date & time",
            value: `<t:${moment
              .tz(
                `${eventDateTime.split(" ")[0]}T${eventDateTime.split(" ")[1]}`,
                `${isoParsingDateFormat}T${isoTimeFormat}`,
                getTimzeonValueFromLabel(timezone),
              )
              .unix()}:F>`,
            inline: true,
          },
          { name: "Game name", value: gameName, inline: true },
          {
            name: "Max num of teams",
            value: "Unlimited",
          },
          {
            name: "Max num of team players",
            value: "Unlimited",
          },
          { name: "Hosted by", value: `${interaction.user.username}` },
        ]);

      const buttons = new MessageActionRow().addComponents(
        new MessageButton().setCustomId("createTeam").setLabel("Create Team").setStyle("PRIMARY"),
      );

      const setMaxNumButtons = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("setMaxNumTeams")
          .setLabel("Set max num of teams")
          .setStyle("SECONDARY"),
        new MessageButton()
          .setCustomId("setMaxNumTeamPlayers")
          .setLabel("Set max num of team players")
          .setStyle("SECONDARY"),
      );

      const manageEventButtons = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("editTeamEventInfo")
          .setLabel("⚙️  Edit event info")
          .setStyle("SECONDARY"),
        new MessageButton()
          .setCustomId("deleteEvent")
          .setLabel("🗑️  Delete event")
          .setStyle("DANGER"),
      );

      if (!interaction.inCachedGuild()) return;

      const id = await addEvent({
        eventName: eventName,
        eventHost: interaction.user.username,
        gameName: gameName,
        description: description,
        dateTime: new Date(
          moment
            .tz(
              `${eventDateTime.split(" ")[0]}T${eventDateTime.split(" ")[1]}`,
              `${isoParsingDateFormat}T${isoTimeFormat}`,
              getTimzeonValueFromLabel(timezone),
            )
            .format(),
        ).toISOString(),
        isTeamEvent: true,
        discordServerId: interaction.guild.id,
        timezone: timezone,
        channelId: interaction.channel!.id,
        discordServerName: interaction.guild.name,
      });

      eventEmbed.setFooter({
        text: `Event ID: ${id}`,
      });

      const reply = await interaction.channel?.send({
        embeds: [eventEmbed],
        components: [buttons, setMaxNumButtons, manageEventButtons],
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
