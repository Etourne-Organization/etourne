import {
  Client,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  ModalSubmitInteraction,
} from "discord.js";

import BOT_CONFIGS from "botConfig";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { ModalSubmit } from "../../type";
import { getColumnValueById } from "supabaseDB/methods/events";
import { addTeam, setColumnValue } from "supabaseDB/methods/teams";

const teamModal: ModalSubmit = {
  customId: "teamModalSubmit",
  run: async (client: Client, interaction: ModalSubmitInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      await interactionHandler.processing("Creating Team...");

      const eventId = interaction.message?.embeds[0].footer?.text.split(": ")[1] || "";

      const maxNumTeamPlayers = await getColumnValueById({
        id: parseInt(eventId),
        columnName: "maxNumTeamPlayers",
      });

      const eventName = interaction.message?.embeds[0].title;
      const eventDateTime = interaction.message?.embeds[0].fields?.find(
        (r) => r.name === "Event date & time",
      )?.value;

      const teamName: string = interaction.fields.getTextInputValue("teamName");
      const teamShortDescription: string =
        interaction.fields.getTextInputValue("teamShortDescription");

      const buttons = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("registerTeamPlayer")
          .setLabel("Register yourself")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("unregisterTeamPlayer")
          .setLabel("Unregister yourself")
          .setStyle("DANGER"),
      );

      const manageTeamPlayersButtons = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("removeTeamPlayer")
          .setLabel("❌  Remove team player")
          .setStyle("SECONDARY"),
      );

      const manageTeamButtons = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("editTeamInfo")
          .setLabel("⚙️  Edit team info")
          .setStyle("SECONDARY"),
        new MessageButton()
          .setCustomId("deleteTeam")
          .setLabel("🗑️  Delete team")
          .setStyle("DANGER"),
      );

      const teamEmbed = new MessageEmbed()
        .setColor(BOT_CONFIGS.color.default)
        .setTitle(teamName)
        .setDescription(`>>> ${teamShortDescription}`)
        .addFields([
          {
            name: "Team Leader",
            value: interaction.user.username,
          },
          {
            name: "Event Name",
            value: eventName || "Unknown",
          },
          {
            name: "Event Date and Time",
            value: eventDateTime || "Unknown",
          },
          {
            name: `Registered players 0/${
              maxNumTeamPlayers.length > 0 ? maxNumTeamPlayers[0]["maxNumTeamPlayers"] : "unlimited"
            }`,
            value: ` `,
          },
        ]);

      const teamId = await addTeam({
        eventId: parseInt(eventId),
        teamName: teamName,
        teamDescription: teamShortDescription,
        teamLeaderDiscordUserId: interaction.user.id,
        teamLeaderUsername: interaction.user.username,
        discordServerId: interaction.guild!.id,
      });

      teamEmbed.setFooter({
        text: `Team ID: ${teamId} Event ID: ${eventId}`,
      });

      const reply = await interaction.channel?.send({
        embeds: [teamEmbed],
        components: [buttons, manageTeamPlayersButtons, manageTeamButtons],
      });

      await setColumnValue({
        data: [
          {
            id: teamId,
            key: "messageId",
            value: reply!.id,
          },
        ],
      });

      await interactionHandler
        .embeds(new CustomMessageEmbed().setTitle("Team created successfully!").Success)
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

export default teamModal;
