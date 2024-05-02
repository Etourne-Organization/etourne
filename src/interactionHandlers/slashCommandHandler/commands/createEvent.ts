import { BaseCommandInteraction, Client, MessageActionRow, MessageSelectMenu } from "discord.js";

import { checkServerExists } from "supabaseDB/methods/servers";
import { getUserRole } from "supabaseDB/methods/users";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { Command } from "../type";
import { createServerNotRegisteredEmbed } from "../utils/embeds";

const createEvent: Command = {
  name: "createevent",
  description: "Create event",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      interactionHandler.processing();

      if (
        !(await checkServerExists({
          discordServerId: interaction.guild!.id,
        }))
      ) {
        const notRegisteredEmbed = createServerNotRegisteredEmbed();
        return interactionHandler.embeds(notRegisteredEmbed).editReply();
      }

      const userRoleDB = await getUserRole({
        discordUserId: interaction.user.id,
        discordServerId: interaction.guild!.id,
      });

      if (
        userRoleDB.length === 0 ||
        (userRoleDB[0]["roleId"] !== 3 && userRoleDB[0]["roleId"] !== 2)
      ) {
        return interactionHandler
          .embeds(
            new CustomMessageEmbed().setTitle("You are not allowed to run this command!").Error,
          )
          .editReply();
      }

      const selectMenuOptions: Array<{
        label: string;
        description: string;
        value: string;
      }> = [
        {
          label: "Create normal event",
          description: "Create normal event with no team feature",
          value: "createEvent",
        },
        {
          label: "Create team event",
          description: "Create team event with team creation feature",
          value: "createTeamEvent",
        },
      ];

      const selectMenu = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("selectEventType")
          .setPlaceholder("Select event type you would like to create")
          .addOptions(selectMenuOptions),
      );
      return interactionHandler
        .embeds(
          new CustomMessageEmbed().setTitle("Select event type you would like to create").Info,
        )
        .editReply({
          components: [selectMenu],
        });
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().defaultErrorDescription().Error)
          .editReply(),
      );
    }
  },
};

export default createEvent;
