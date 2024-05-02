import { BaseCommandInteraction, Client } from "discord.js";

import { Command } from "../type";

import { checkServerExists } from "supabaseDB/methods/servers";
import { checkAddUser, checkUserExists } from "supabaseDB/methods/users";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import {
  createNonAdminEmbed,
  createServerNotRegisteredEmbed,
  createUserAlreadyRegisteredEmbed,
} from "../utils/embeds";

const registerAdmin: Command = {
  name: "registeradmin",
  description: "Register user who added the bot as Admin in Etourne database",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      await interactionHandler.processing();

      const hasAuditLogPermission =
        interaction.guild!.members.me?.permissions.has("VIEW_AUDIT_LOG");

      if (
        !(await checkServerExists({
          discordServerId: interaction.guild!.id,
        }))
      ) {
        const notRegisteredEmbed = createServerNotRegisteredEmbed();
        return interactionHandler.embeds(notRegisteredEmbed).editReply();
      }

      if (
        await checkUserExists({
          discordServerId: interaction.guild!.id,
          discordUserId: interaction.user.id,
        })
      ) {
        const alreadyRegisteredEmbed = createUserAlreadyRegisteredEmbed();
        return interactionHandler.embeds(alreadyRegisteredEmbed).editReply();
      } else if (hasAuditLogPermission) {
        const fetchedLog = await interaction.guild!.fetchAuditLogs({
          type: "BOT_ADD",
          limit: 1,
        });

        const log = fetchedLog.entries.first();

        if (log?.executor!.id !== interaction.user.id) {
          const nonAdminEmbed = createNonAdminEmbed();
          return interactionHandler.embeds(nonAdminEmbed).editReply();
        }

        await checkAddUser({
          username: log!.executor!.username,
          discordServerId: interaction.guild!.id,
          discordUserId: log!.executor!.id,
          roleId: 3,
        });
        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("You have been registered!").Success)
          .editReply();
      }
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler.embeds(new CustomMessageEmbed().defaultErrorTitle().Error).editReply(),
      );
    }
  },
};

export default registerAdmin;
