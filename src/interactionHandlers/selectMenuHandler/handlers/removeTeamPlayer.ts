import {
  ButtonInteraction,
  Client,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  SelectMenuInteraction,
} from "discord.js";

import InteractionHandler from "utils/interactions/interactionHandler";
import logError, { logFormattedError } from "utils/logging/logError";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import BOT_CONFIGS from "botConfig";
import { removePlayer } from "supabaseDB/methods/teamPlayers";
import { checkTeamExists, getColumnValueById } from "supabaseDB/methods/teams";
import { SelectMenu } from "../type";

const removeTeamPlayer: SelectMenu = {
  customId: "removeTeamPlayer",
  run: async (client: Client, interaction: SelectMenuInteraction) => {
    try {
      const username: string = interaction.values[0].split("||")[0];
      const userId: string = interaction.values[0].split("||")[1];
      const teamId = interaction.message.embeds[0].footer?.text.split(" ")[2] || "";

      const confirmationButtons = new MessageActionRow().addComponents(
        new MessageButton().setCustomId("deleteYes").setLabel("✔").setStyle("SUCCESS"),
        new MessageButton().setCustomId("deleteNo").setLabel("✖").setStyle("DANGER"),
      );

      await interaction.update({
        embeds: [
          new CustomMessageEmbed().setTitle(`Are you sure you want to remove ${username}?`).Question,
        ],
        components: [confirmationButtons],
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filter = (btnInteraction: ButtonInteraction | any) =>
        (btnInteraction.customId === "deleteYes" || btnInteraction.customId === "deleteNo") &&
        btnInteraction.user.id === interaction.user.id;

      const collector = interaction.channel?.createMessageComponentCollector({
        filter,
        time: 15000,
        max: 1,
        maxComponents: 1,
      });

      collector?.on("collect", async (btnInteraction: ButtonInteraction) => {
        const btnInteractionHandler = new InteractionHandler(btnInteraction);

        if (btnInteraction.customId === "deleteYes") {
          await interaction.deleteReply();

          await btnInteractionHandler.processing();

          if (await checkTeamExists({ teamId: parseInt(teamId) }))
            await removePlayer({
              discordUserId: userId,
              teamId: parseInt(teamId),
            });

          const messageIdInfo = await getColumnValueById({
            id: parseInt(teamId),
            columnName: "messageId",
          });

          const messageId = messageIdInfo[0]?.messageId || "";

          const fetchedMessage = await interaction.channel?.messages.fetch(messageId);

          if (fetchedMessage) {
            const embed = fetchedMessage.embeds[0];

            const registeredPlayersField = embed.fields?.find((field) =>
              field.name.includes("Registered players"),
            );

            const registeredPlayers =
              registeredPlayersField?.value.split(">>> ")[1]?.split("\n").filter(Boolean) || [];
            const registeredIndex = registeredPlayers.indexOf(interaction.user.username);

            // ? Check if the current user is not registered
            if (registeredIndex === -1) {
              logError("bruh, what?  - removeTeamPlayer");
              return;
            }

            // ? If the user is registered, remove them from the list
            registeredPlayers.splice(registeredIndex, 1);
            const newPlayersList = registeredPlayers.join("\n");

            // ? Prepare updated player list to go back to the orignal embed field
            const numRegisteredPlayers = registeredPlayers.length;
            const maxNumPlayersEmbedValue =
              registeredPlayersField?.name.split(" ")[2].split("/")[1] || "";

            const updatedField = {
              name: `Registered players ${numRegisteredPlayers}/${maxNumPlayersEmbedValue}`,
              value: `>>> ${newPlayersList}`,
            };

            // ? update embed field
            const fields =
              embed.fields?.map((field) =>
                field.name.includes("Registered players") ? updatedField : field,
              ) || [];

            const editedEmbed = new MessageEmbed()
              .setColor(BOT_CONFIGS.color.default)
              .setTitle(embed.title || "Undefined")
              .setDescription(embed.description || "Undefined")
              .addFields(fields)
              .setFooter({ text: `${embed.footer?.text}` });

            await fetchedMessage.edit({
              embeds: [editedEmbed],
            });
          }
          await btnInteractionHandler
            .embeds(new CustomMessageEmbed().setTitle(`Removed ${username} successfully!`).Success)
            .editReply();
        } else if (btnInteraction.customId === "deleteNo") {
          await interaction.deleteReply();

          await btnInteractionHandler
            .embeds(new CustomMessageEmbed().setTitle(`Player ${username} was not removed`).Error)
            .reply();
        }
      });
    } catch (err) {
      logFormattedError(err);
    }
  },
};

export default removeTeamPlayer;
