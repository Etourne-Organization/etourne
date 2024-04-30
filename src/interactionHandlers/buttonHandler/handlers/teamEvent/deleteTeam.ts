import { ButtonInteraction, Client, MessageActionRow, MessageButton } from "discord.js";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import {
  checkTeamExists,
  deleteTeam as deleteTeamSupabase,
} from "supabaseDB/methods/teams";
import { getUserRole } from "supabaseDB/methods/users";
import { ButtonFunction } from "../../type";

const deleteTeam: ButtonFunction = {
  customId: "deleteTeam",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      await interactionHandler.processing();

      const teamLeader = interaction.message?.embeds[0].fields?.find(
        (r) => r.name === "Team Leader",
      );

      // check user role in DB
      const userRoleDB = await getUserRole({
        discordUserId: interaction.user.id,
        discordServerId: interaction.guild!.id,
      });

      if (
        interaction.user.username !== teamLeader?.value &&
        (userRoleDB.length === 0 ||
          (userRoleDB[0]["roleId"] !== 3 && userRoleDB[0]["roleId"] !== 2))
      ) {
        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("You are not allowed to use this button!").Error)
          .editReply();
      }

      const teamId: string = interaction.message.embeds[0].footer?.text.split(" ")[2] || "";

      const fetchedMessage = await interaction.channel?.messages.fetch(interaction.message.id);

      if (fetchedMessage) {
        const confirmationButtons = new MessageActionRow().addComponents(
          new MessageButton().setCustomId("deleteYes").setLabel("✔").setStyle("SUCCESS"),
          new MessageButton().setCustomId("deleteNo").setLabel("✖").setStyle("DANGER"),
        );

        await interactionHandler
          .embeds(
            new CustomMessageEmbed().setTitle("Are you sure you want to delete your team?").Question,
          )
          .editReply({
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
            await fetchedMessage.delete();
            await interaction.deleteReply();

            btnInteractionHandler.processing();

            if (await checkTeamExists({ teamId: parseInt(teamId) }))
              await deleteTeamSupabase({ teamId: parseInt(teamId) });

            await btnInteractionHandler
              .embeds(new CustomMessageEmbed().setTitle("Team deleted successfully!").Success)
              .editReply();
          } else if (btnInteraction.customId === "deleteNo") {
            await interaction.deleteReply();

            await btnInteractionHandler
              .embeds(new CustomMessageEmbed().setTitle("Team not deleted").Info)
              .reply();
          }
        });
      } else {
        await interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("Something went wrong").Error)
          .editReply();
      }
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().defaultErrorDescription().Error)
          .reply(),
      );
    }
  },
};

export default deleteTeam;
