import { BaseCommandInteraction, Client } from "discord.js";

import { checkServerExists } from "supabaseDB/methods/servers";
import { getUserRole, setUserRole as setUserRoleSupabase } from "supabaseDB/methods/users";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { Command } from "../type";
import { createServerNotRegisteredEmbed } from "../utils/embeds";

const setUserRole: Command = {
  name: "setuserrole",
  description: "Set user role",
  type: "CHAT_INPUT",
  options: [
    {
      name: "user",
      description: "Select user",
      type: "USER",
      required: true,
    },
    {
      name: "role",
      description: "Select role to assign",
      type: "STRING",
      required: true,
      choices: [
        {
          name: "Player",
          value: "1",
        },
        {
          name: "Manager",
          value: "2",
        },
        {
          name: "Admin",
          value: "3",
        },
      ],
    },
  ],
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

      const user = interaction.options.getUser("user");
      const role = interaction.options.get("role");

      if (!role || !role.value || !user)
        return interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().SHORT.Error)
          .editReply();

      const userRoleDB = await getUserRole({
        discordUserId: interaction.user.id,
        discordServerId: interaction.guild!.id,
      });

      /**
       * Only the creator of the bot can run this command with no restriction
       * Checks if the executor is admin or not: reject if not
       * */
      if (interaction.user.id !== "374230181889572876") {
        if (userRoleDB.length === 0 || userRoleDB[0]["roleId"] !== 3) {
          return interactionHandler
            .embeds(
              new CustomMessageEmbed().setTitle("You are not allowed run this command!").Error,
            )
            .editReply();
        }
      }

      await setUserRoleSupabase({
        discordServerId: interaction.guild!.id,
        discordUserId: user.id,
        roleId: parseInt(role.value as string),
        username: user.username,
      });

      await interactionHandler
        .embeds(new CustomMessageEmbed().setTitle(`${user!.username}'s role has been set!`).Success)
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

export default setUserRole;
