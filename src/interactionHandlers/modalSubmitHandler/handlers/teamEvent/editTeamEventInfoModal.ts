import { Client, MessageEmbed, ModalSubmitInteraction } from "discord.js";
import moment from "moment-timezone";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import BOT_CONFIGS from "botConfig";
import { getColumnValueById, updateEvent } from "supabaseDB/methods/events";
import {
  getTimzeonValueFromLabel,
  isoParsingDateFormat,
  isoTimeFormat,
} from "utils/timezone/timezone";
import updateAllTeamInfo from "./utils/updateAllTeamInfo";
import { ModalSubmit } from "../../type";

const editTeamEventInfoModal: ModalSubmit = {
  customId: "editTeamEventInfoModal",
  run: async (client: Client, interaction: ModalSubmitInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      const eventId = interaction.message?.embeds[0].footer?.text.split(": ")[1] || "";

      const eventName = interaction.fields.getTextInputValue("eventName");
      const gameName = interaction.fields.getTextInputValue("gameName");
      const timezone = interaction.fields.getTextInputValue("timezone");
      const eventDateTime = interaction.fields.getTextInputValue("date");
      const description = interaction.fields.getTextInputValue("eventDescription");

      const maxNumTeams = await getColumnValueById({
        id: parseInt(eventId),
        columnName: "maxNumTeams",
      });

      const maxNumTeamPlayers = await getColumnValueById({
        id: parseInt(eventId),
        columnName: "maxNumTeamPlayers",
      });

      const eventHost = interaction.message?.embeds[0].fields?.find((r) => r.name === "Hosted by");

      const eventDateTimeEmbedValue = interaction.message?.embeds[0].fields?.find((r) =>
        r.name.includes("Event date & time"),
      );

      const editedEmbed = new MessageEmbed()
        .setColor(BOT_CONFIGS.color.default)
        .setTitle(eventName)
        .setDescription(
          `**----------------------------------------** \n **Event description:** \n \n >>> ${description}  \n \n`,
        )
        .addFields([
          {
            name: "Event date & time",
            inline: true,
            value: eventDateTime
              ? `<t:${moment
                  .tz(
                    `${eventDateTime.split(" ")[0]}T${eventDateTime.split(" ")[1]}`,
                    `${isoParsingDateFormat}T${isoTimeFormat}`,
                    getTimzeonValueFromLabel(timezone),
                  )
                  .unix()}:F>`
              : eventDateTimeEmbedValue?.value || "",
          },
          { name: "Game name", value: gameName, inline: true },
          {
            name: "Max num of teams",
            value: maxNumTeams[0]["maxNumTeams"]
              ? maxNumTeams[0]["maxNumTeams"].toString()
              : "Unlimited",
          },
          {
            name: "Max num of team players",
            value: maxNumTeamPlayers[0]["maxNumTeamPlayers"]
              ? maxNumTeamPlayers[0]["maxNumTeamPlayers"].toString()
              : "Unlimited",
          },
          { name: "Hosted by", value: `${eventHost?.value}` },
        ])
        .setFooter({
          text: `Event ID: ${eventId}`,
        });

      if (!interaction.inCachedGuild()) return;

      await updateEvent({
        eventId: parseInt(eventId),
        eventName: eventName,
        gameName: gameName,
        description: description,
        dateTime: eventDateTime
          ? new Date(
              moment
                .tz(
                  `${eventDateTime.split(" ")[0]}T${eventDateTime.split(" ")[1]}`,
                  `${isoParsingDateFormat}T${isoTimeFormat}`,
                  getTimzeonValueFromLabel(timezone),
                )
                .format(),
            ).toISOString()
          : null,
        isTeamEvent: false,
        discordServerId: interaction.guild.id,
        timezone: timezone,
      });

      updateAllTeamInfo({
        eventId: parseInt(eventId),
        interaction: interaction,
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
