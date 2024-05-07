import { BaseCommandInteraction, Client } from "discord.js";

import { validateServerExists, validateUserPermission } from "src/interactionHandlers/validate";
import { setUserRoleDB } from "supabaseDB/methods/users";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { USER_ROLES } from "constants/userRoles";
import { Command } from "../type";

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
          value: USER_ROLES.Player.toString(),
        },
        {
          name: "Manager",
          value: USER_ROLES.Manager.toString(),
        },
        {
          name: "Admin",
          value: USER_ROLES.Admin.toString(),
        },
      ],
    },
  ],
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interactionHandler.processing();

      const user = interaction.options.getUser("user");
      const role = interaction.options.get("role");

      if (!role || !role.value || !user)
        return interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().SHORT.Error)
          .editReply();

      const {
        isValid,
        embed,
        value: serverId,
      } = await validateServerExists(interaction.guildId);
      if (!isValid) return interactionHandler.embeds(embed).editReply();

      // ? Ensure only admins and bot owner can set a users role
      if (interaction.user.id !== process.env.OWNER_ID) {
        const { isValid, embed } = await validateUserPermission(
          serverId,
          interaction.user.id,
          true,
        );
        if (!isValid) return interactionHandler.embeds(embed).editReply();
      }

      await setUserRoleDB(user.id, serverId, user.username, parseInt(role.value as string));

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
