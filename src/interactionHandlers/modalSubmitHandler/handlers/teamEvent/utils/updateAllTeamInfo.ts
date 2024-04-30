import dayjs from "dayjs";
import { MessageEmbed, ModalSubmitInteraction } from "discord.js";

import { Teams } from "utils/dbTypes";
import { logFormattedError } from "utils/logging/logError";
import BOT_CONFIGS from "botConfig";
import { getColumnValueById } from "supabaseDB/methods/events";
import { getColumnValueByEventId } from "supabaseDB/methods/teams";

interface updateAllTeamInfo {
  eventId: number;
  interaction: ModalSubmitInteraction;
}

const updateAllTeamInfo = async (props: updateAllTeamInfo) => {
  try {
    const { eventId, interaction } = props;

    const values = (await getColumnValueByEventId({
      eventId: eventId,
      columnName: "*",
    })) as unknown as Array<Teams>;

    if (values.length > 0) {
      for (const value of values) {
        const fetchedMessage = await interaction.channel?.messages.fetch(value["messageId"]);

        if (fetchedMessage) {
          // get registered team players
          const registeredPlayers = fetchedMessage.embeds[0].fields?.find((r) =>
            r.name.includes("Registered players"),
          );

          const numRegisteredPlayers: number = parseInt(
            registeredPlayers?.name.split(" ")[2].split("/")[0] || "",
          );

          const eventInfo = await getColumnValueById({
            id: eventId,
            columnName: ["eventName", "dateTime", "timezone", "maxNumTeamPlayers"],
          });

          const editedEmbed = new MessageEmbed()
            .setColor(BOT_CONFIGS.color.default)
            .setTitle(value.name)
            .setDescription(`>>> ${value.description}`)
            .addFields([
              {
                name: "Team Leader",
                value: interaction.user.username,
              },
              {
                name: "Event Name",
                value: eventInfo[0]?.eventName || "",
              },
              {
                name: "Event Date and Time",
                value: `<t:${dayjs(eventInfo[0]?.dateTime || "").unix()}:F>`,
              },
              {
                name: `Registered players ${numRegisteredPlayers}/${eventInfo[0]["maxNumTeamPlayers"]}`,
                value:
                  registeredPlayers && registeredPlayers.value.length > 0
                    ? registeredPlayers.value
                    : " ",
              },
            ])
            .setFooter({
              text: `Team ID: ${value["id"]} Event ID: ${eventId}`,
            });

          await fetchedMessage.edit({
            embeds: [editedEmbed],
          });
        }
      }
    }
  } catch (err) {
    logFormattedError(err);
  }
};

export default updateAllTeamInfo;
