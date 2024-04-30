import { ButtonInteraction, Client, MessageActionRow, MessageButton } from "discord.js";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { deleteEvent as deleteEventSupabase } from "supabaseDB/methods/events";
import { getUserRole } from "supabaseDB/methods/users";
import { ButtonFunction } from "../../type";

const deleteEvent: ButtonFunction = {
  customId: "deleteEvent",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interactionHandler.processing();

      // check user role in DB
      const userRoleDB = await getUserRole({
        discordUserId: interaction.user.id,
        discordServerId: interaction.guild!.id,
      });

      if (
        userRoleDB.length === 0 ||
        (userRoleDB[0]["roleId"] !== 3 && userRoleDB[0]["roleId"] !== 2)
      ) {
        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("You are not allowed to use this button!").Error)
          .reply();
      }

      const eventId: string = interaction.message.embeds[0].footer?.text.split(": ")[1] || "";

      const fetchedMessage = await interaction.channel?.messages.fetch(interaction.message.id);

      if (fetchedMessage) {
        const confirmationButtons = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId(`deleteYes-${interaction.id}`)
            .setLabel("✔")
            .setStyle("SUCCESS"),
          new MessageButton()
            .setCustomId(`deleteNo-${interaction.id}`)
            .setLabel("✖")
            .setStyle("DANGER"),
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
          (btnInteraction.customId === `deleteYes-${interaction.id}` ||
            btnInteraction.customId === `deleteNo-${interaction.id}`) &&
          btnInteraction.user.id === interaction.user.id;

        const collector = interaction.channel?.createMessageComponentCollector({
          filter,
          time: 15000,
          // max: 1,
          // maxComponents: 1,
        });

        collector?.on("collect", async (btnInteraction: ButtonInteraction) => {
          const btnInteractionHandler = new InteractionHandler(btnInteraction);

          if (btnInteraction.customId.includes("deleteYes")) {
            await fetchedMessage.delete();

            btnInteractionHandler.processing();

            await deleteEventSupabase({ eventId: parseInt(eventId) });

            await interaction.deleteReply();

            await btnInteractionHandler
              .embeds(new CustomMessageEmbed().setTitle("Event deleted successfully!").Success)
              .editReply();
          } else if (btnInteraction.customId.includes("deleteNo")) {
            await interaction.deleteReply();

            await btnInteractionHandler
              .embeds(new CustomMessageEmbed().setTitle("Event not deleted").Info)
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
          .editReply(),
      );
    }
  },
};

export default deleteEvent;
