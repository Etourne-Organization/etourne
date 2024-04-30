import { Client, MessageEmbed, ModalSubmitInteraction } from "discord.js";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import BOT_CONFIGS from "botConfig";
import { updateTeam } from "supabaseDB/methods/teams";
import { ModalSubmit } from "../../type";

const editTeamInfoModal: ModalSubmit = {
  customId: "editTeamInfoModal",
  run: async (client: Client, interaction: ModalSubmitInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      const teamId = interaction.message?.embeds[0].footer?.text.split(" ")[2] || "";
      const eventId = interaction.message?.embeds[0].footer?.text.split(" ")[5] || "";

      const registeredPlayers = interaction.message?.embeds[0].fields?.find((r) =>
        r.name.includes("Registered players"),
      );

      const eventDateTime = interaction.message?.embeds[0].fields?.find(
        (r) => r.name === "Event Date and Time",
      );

      const eventName = interaction.message?.embeds[0].fields?.find((r) => r.name === "Event Name");

      const teamLeader = interaction.message?.embeds[0].fields?.find(
        (r) => r.name === "Team Leader",
      );

      const teamName: string = interaction.fields.getTextInputValue("teamName");
      const teamShortDescription: string =
        interaction.fields.getTextInputValue("teamShortDescription");

      const editedEmbed = new MessageEmbed()
        .setColor(BOT_CONFIGS.color.default)
        .setTitle(teamName)
        .setDescription(`>>> ${teamShortDescription}`)
        .addFields([
          {
            name: "Team Leader",
            value: teamLeader?.value || "",
          },
          {
            name: "Event Name",
            value: eventName?.value || "",
          },
          {
            name: "Event Date and Time",
            value: eventDateTime?.value || "",
          },
          {
            name: registeredPlayers?.name || "",
            value:
              registeredPlayers && registeredPlayers.value.length > 0
                ? registeredPlayers.value
                : " ",
          },
        ])
        .setFooter({
          text: `Team ID: ${teamId} Event ID: ${eventId}`,
        });

      if (!interaction.inCachedGuild()) return;

      await updateTeam({
        id: parseInt(teamId),
        teamName: teamName,
        teamDescription: teamShortDescription,
      });

      await interactionHandler.embeds(editedEmbed).editReply();

      return interactionHandler
        .embeds(new CustomMessageEmbed().setTitle("Team info updated successfully!").Success)
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

export default editTeamInfoModal;
