import dayjs from "dayjs";
import { BaseCommandInteraction, Client } from "discord.js";

import {
  createNormalCreatorButtonComponents,
  createTeamCreatorButtonComponents,
} from "src/interactionHandlers/modalSubmitHandler/utils/btnComponents";
import {
  createNormalCreatorEmbed,
  createTeamCreatorEmbed,
} from "src/interactionHandlers/modalSubmitHandler/utils/embeds";
import { validateServerExists, validateUserPermission } from "src/interactionHandlers/validate";
import { getEventDB } from "supabaseDB/methods/events";
import { getPlayersDB } from "supabaseDB/methods/players";
import { updateEventColumnsDB } from "supabaseDB/methods/columns";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { Command } from "../type";
import { createNonSharableEventEmbed } from "../utils/embeds";

const getEvent: Command = {
  name: "getevent",
  description: "Get event by event ID",
  type: "CHAT_INPUT",
  options: [
    {
      name: "eventid",
      description: "Enter event ID",
      type: "NUMBER",
      required: true,
    },
  ],
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      interactionHandler.processing();

      const {
        isValid: hasServer,
        embed: notRegisteredEmbed,
        value: serverId,
      } = await validateServerExists(interaction.guildId);
      if (!hasServer) return interactionHandler.embeds(notRegisteredEmbed).editReply();

      const eventId = interaction.options.get("eventid") as unknown as { value: number };

      const { isValid, embed } = await validateUserPermission(serverId, interaction.user.id);
      if (!isValid) return interactionHandler.embeds(embed).editReply();

      await interactionHandler.editReply({
        content: ":arrows_counterclockwise: Getting event...",
      });

      const eventInfo = await getEventDB(eventId?.value);
      if (!eventInfo)
        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("Event not found").Error)
          .editReply();

      if (eventInfo.channelId) {
        const fetchedChannel = await interaction.guild?.channels.fetch(eventInfo.channelId);

        const fetchedMessage = fetchedChannel?.isText()
          ? await fetchedChannel.messages.fetch(eventInfo?.messageId || "")
          : null;

        if (fetchedMessage) {
          const embed = createNonSharableEventEmbed(fetchedMessage, interaction.guildId);
          return interactionHandler.embeds(embed).editReply();
        }
      }

      // check if event is Normal Event
      if (!eventInfo.isTeamEvent) {
        const dbPlayers = await getPlayersDB(eventId.value);

        let players = "";

        if (dbPlayers && dbPlayers.length > 0)
          dbPlayers.forEach((player) => {
            if (player) players += `${player.Users.username}\n`;
          });

        const eventEmbed = createNormalCreatorEmbed({
          description: eventInfo.description!,
          eventDateTime: `<t:${dayjs(eventInfo["dateTime"]).unix()}:F>`,
          eventHost: eventInfo.eventHost!,
          eventId: eventId.value!.toString(),
          eventName: eventInfo.gameName!,
          gameName: eventInfo.gameName!,
          teamPlayers: {
            registered: dbPlayers?.length.toString(),
            max: eventInfo.maxNumPlayers!.toString(),
          },
          replaceRegisteredPlayers: {
            value: players,
          },
        });

        const messageComponents = createNormalCreatorButtonComponents();

        const newEventEmbed = await interaction.channel?.send({
          embeds: [eventEmbed],
          components: messageComponents,
        });

        await updateEventColumnsDB(eventId.value, [
          { key: "messageId", value: newEventEmbed!.id },
          { key: "channelId", value: interaction.channel!.id },
        ]);

        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("Event shared successfully").Success)
          .editReply();
      }

      const eventEmbed = createTeamCreatorEmbed({
        description: eventInfo.description!,
        eventDateTime: `<t:${dayjs(eventInfo["dateTime"]).unix()}:F>`,
        eventHost: eventInfo.eventHost!,
        eventId: eventId.value,
        eventName: eventInfo.gameName!,
        gameName: eventInfo.gameName!,
        maxNumTeamPlayers: eventInfo?.maxNumTeamPlayers?.toString(),
        maxNumTeams: eventInfo?.maxNumTeams!.toString(),
      });

      const messageComponents = createTeamCreatorButtonComponents();

      const newEventEmbed = await interaction.channel?.send({
        embeds: [eventEmbed],
        components: messageComponents,
      });

      await updateEventColumnsDB(eventId.value, [
        { key: "messageId", value: newEventEmbed!.id },
        { key: "channelId", value: interaction.channel!.id },
      ]);

      return interactionHandler
        .embeds(new CustomMessageEmbed().setTitle("Event shared successfully").Success)
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

export default getEvent;
