import dayjs from "dayjs";
import { BaseCommandInteraction, Client } from "discord.js";

import { validateServerExists } from "src/interactionHandlers/validate";
import { getAllServerEventColumnsDB } from "supabaseDB/methods/events";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { Command } from "../type";

const listServerEvents: Command = {
  name: "listserverevents",
  description: "View the list of all the servers",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      await interactionHandler.processing();

      const {
        isValid,
        embed: serverNotExistsEmbed,
        value: serverId,
      } = await validateServerExists(interaction.guildId);
      if (!isValid) return interactionHandler.embeds(serverNotExistsEmbed).editReply();

      const allEvents = await getAllServerEventColumnsDB(serverId);

      let eventDescription = "";
      if (!allEvents) eventDescription = "No events";
      else
        allEvents.forEach((e) => {
          eventDescription += `## ${e.eventName}\n**ID:** ${
            e.id
          }\n**Game name:** ${e.gameName}\n**Date and Time:** <t:${dayjs(
            e["dateTime"],
          ).unix()}:F>\n**Event type:** ${e.isTeamEvent ? "Team" : "Normal (no team)"}\n\n`;
        });

      const embed = new CustomMessageEmbed()
        .setTitle(`All events in ${interaction.guild?.name}`)
        .setDescription(eventDescription)
        .setThumbnail(`${interaction.guild!.iconURL()}`).Info;

      await interaction.channel?.send({
        embeds: [embed],
      });

      return interactionHandler
        .embeds(new CustomMessageEmbed().setTitle("List of all events shared successfully").Success)
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

export default listServerEvents;
