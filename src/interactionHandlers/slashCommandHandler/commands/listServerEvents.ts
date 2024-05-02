import dayjs from "dayjs";
import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";

import BOT_CONFIGS from "botConfig";
import { getAllServerEvents } from "supabaseDB/methods/events";
import { checkServerExists } from "supabaseDB/methods/servers";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { Command } from "../type";
import { createServerNotRegisteredEmbed } from "../utils/embeds";

const listServerEvents: Command = {
  name: "listserverevents",
  description: "View the list of all the servers",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      await interactionHandler.processing();

      if (
        !(await checkServerExists({
          discordServerId: interaction.guild!.id,
        }))
      ) {
        const notRegisteredEmbed = createServerNotRegisteredEmbed();
        return interactionHandler.embeds(notRegisteredEmbed).editReply();
      }

      const allEvents = await getAllServerEvents({
        discordServerId: interaction.guild!.id,
      });

      let eventString = allEvents.length > 0 ? "" : "No events";

      allEvents.forEach((e) => {
        eventString += `## ${e.eventName}\n**ID:** ${
          e.id
        }\n**Game name:** ${e.gameName}\n**Date and Time:** <t:${dayjs(
          e["dateTime"],
        ).unix()}:F>\n**Event type:** ${e.isTeamEvent ? "Team" : "Normal (no team)"}\n\n`;
      });

      const embed = new MessageEmbed()
        .setColor(BOT_CONFIGS.color.default)
        .setTitle(`All events in ${interaction.guild?.name}`)
        .setThumbnail(`${interaction.guild!.iconURL()}`)
        .setDescription(eventString);

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
