import dayjs from "dayjs";
import {
  BaseCommandInteraction,
  Client,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import BOT_CONFIGS from "botConfig";
import COMMAND_IDS from "../../../utils/commandIds";
import { getAllColumnValueById, setColumnValue } from "supabaseDB/methods/events";
import { checkServerExists } from "supabaseDB/methods/servers";
import { getAllPlayers } from "supabaseDB/methods/singlePlayers";
import { getUserRole } from "supabaseDB/methods/users";
import { Command } from "../type";

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

      if (
        !(await checkServerExists({
          discordServerId: interaction.guild!.id,
        }))
      ) {
        const embed = new MessageEmbed()
          .setColor(BOT_CONFIGS.color.red)
          .setTitle(":x: Error: Server not registered!")
          .setDescription(
            `Use </registerserver:${COMMAND_IDS.REGISTER_SERVER}> command to register your server in Etourne database.`,
          )
          .setFooter({
            text: "Use /support to seek support if required.",
          })
          .setTimestamp();

        return interactionHandler.embeds(embed).editReply();
      }

      const eventId = interaction.options.get("eventid") as unknown as { value: number };

      const userRoleDB = await getUserRole({
        discordUserId: interaction.user.id,
        discordServerId: interaction.guild!.id,
      });

      if (
        userRoleDB.length === 0 ||
        (userRoleDB[0]["roleId"] !== 3 && userRoleDB[0]["roleId"] !== 2)
      ) {
        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("You are not allowed to run this command!").Error)
          .editReply();
      }

      await interactionHandler.editReply({
        content: ":arrows_counterclockwise: Getting event...",
      });

      const eventInfo = await getAllColumnValueById({
        id: eventId?.value,
      });

      if (eventInfo.length > 0) {
        if (eventInfo[0].channelId) {
          const fetchedChannel = await interaction.guild?.channels.fetch(eventInfo[0].channelId);

          let fetchedMessage;

          try {
            if (fetchedChannel!.isText()) {
              fetchedMessage = await fetchedChannel.messages.fetch(eventInfo[0].messageId);
            }
          } catch (err) {
            console.log(err);
          }

          if (fetchedMessage) {
            const embed = new MessageEmbed()
              .setColor(BOT_CONFIGS.color.red)
              .setTitle(":x: Event cannot be shared")
              .setDescription(
                `The event embed has already been shared in <#${
                  fetchedMessage.channelId
                }> (message link: https://discord.com/channels/${
                  interaction.guild!.id
                }/${fetchedMessage.channelId}/${
                  fetchedMessage.id
                })\nTo reshare the event embed in a new channel, delete the existing event embed.`,
              )
              .setTimestamp();

            return interactionHandler.embeds(embed).editReply();
          }
        }

        // check if the event is team or normal
        if (!eventInfo[0].isTeamEvent) {
          const dbPlayers: [{ username: string; userId: string }?] = await getAllPlayers({
            eventId: eventId?.value,
          });

          let players: string = "";

          if (dbPlayers.length > 0) {
            dbPlayers.forEach((p) => {
              if (p) players += `${p.username}\n`;
            });
          }

          const eventEmbed = new MessageEmbed()
            .setColor(BOT_CONFIGS.color.default)
            .setTitle(eventInfo[0].eventName)
            .setDescription(
              `**----------------------------------------** \n **Event description:** \n \n >>> ${eventInfo[0].description}  \n \n`,
            )
            .addFields([
              {
                name: "Event date & time",
                value: `<t:${dayjs(eventInfo[0]["dateTime"]).unix()}:F>`,
                inline: true,
              },
              {
                name: "Game name",
                value: eventInfo[0].gameName,
                inline: true,
              },
              { name: "Hosted by", value: eventInfo[0].eventHost },
              {
                name: `Registered players ${dbPlayers.length}/${
                  eventInfo[0].maxNumPlayers ? eventInfo[0].maxNumPlayers : "unlimited"
                }`,
                value: players.length > 0 ? `>>> ${players}` : " ",
              },
            ])
            .setFooter({
              text: `Event ID: ${eventId.value}`,
            });

          /* buttons */
          const buttons = new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId("normalEventRegister")
              .setLabel("Register yourself")
              .setStyle("PRIMARY"),
            new MessageButton()
              .setCustomId("normalEventUnregister")
              .setLabel("Unregister yourself")
              .setStyle("DANGER"),
          );

          const managePlayerButtons = new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId("setMaxNumPlayers")
              .setLabel("Set max num of players")
              .setStyle("SECONDARY"),
            new MessageButton()
              .setCustomId("removePlayer")
              .setLabel("❌  Remove player")
              .setStyle("SECONDARY"),
          );

          const manageEventButtons = new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId("editEventInfo")
              .setLabel("⚙️  Edit event info")
              .setStyle("SECONDARY"),
            new MessageButton()
              .setCustomId("deleteEvent")
              .setLabel("🗑️  Delete event")
              .setStyle("DANGER"),
          );

          const newEventEmbed = await interaction.channel?.send({
            embeds: [eventEmbed],
            components: [buttons, managePlayerButtons, manageEventButtons],
          });

          await setColumnValue({
            data: [
              {
                id: eventId.value,
                key: "messageId",
                value: newEventEmbed!.id,
              },
              {
                id: eventId.value,
                key: "channelId",
                value: interaction.channel!.id,
              },
            ],
          });

          return interactionHandler
            .embeds(new CustomMessageEmbed().setTitle("Event shared successfully").Success)
            .editReply();
        } else {
          const eventEmbed = new MessageEmbed()
            .setColor(BOT_CONFIGS.color.default)
            .setTitle(eventInfo[0].eventName)
            .setDescription(
              `**----------------------------------------** \n **Event description:** \n \n >>> ${eventInfo[0].description}  \n \n`,
            )
            .addFields([
              {
                name: "Event date & time",
                value: `<t:${dayjs(eventInfo[0]["dateTime"]).unix()}:F>`,
                inline: true,
              },
              {
                name: "Game name",
                value: eventInfo[0].gameName,
                inline: true,
              },
              {
                name: "Max num of teams",
                value: `${eventInfo[0].maxNumTeams ? eventInfo[0].maxNumTeams : "Unlimited"}`,
              },
              {
                name: "Max num of team players",
                value: `${
                  eventInfo[0].maxNumTeamPlayers ? eventInfo[0].maxNumTeamPlayers : "Unlimited"
                }`,
              },
              { name: "Hosted by", value: eventInfo[0].eventHost },
            ])
            .setFooter({
              text: `Event ID: ${eventId.value}`,
            });

          const buttons = new MessageActionRow().addComponents(
            new MessageButton()
              .setCustomId("createTeam")
              .setLabel("Create Team")
              .setStyle("PRIMARY"),
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

          const newEventEmbed = await interaction.channel?.send({
            embeds: [eventEmbed],
            components: [buttons, setMaxNumButtons, manageEventButtons],
          });

          await setColumnValue({
            data: [
              {
                id: eventId.value,
                key: "messageId",
                value: newEventEmbed!.id,
              },
              {
                id: eventId.value,
                key: "channelId",
                value: interaction.channel!.id,
              },
            ],
          });

          return interactionHandler
            .embeds(new CustomMessageEmbed().setTitle("Event shared successfully").Success)
            .editReply();
        }
      } else {
        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("Event not found").Error)
          .editReply();
      }
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
