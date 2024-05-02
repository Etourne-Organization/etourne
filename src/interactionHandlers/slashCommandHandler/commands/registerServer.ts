import { BaseCommandInteraction, Client } from "discord.js";

import { addServer, checkServerExists } from "supabaseDB/methods/servers";
import { checkAddUser } from "supabaseDB/methods/users";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { Command } from "../type";
import {
  createNonAdminEmbed,
  createRequiredBotPermissionsEmbed,
  createServerAlreadyRegisteredEmbed,
} from "../utils/embeds";

const registerServer: Command = {
  name: "registerserver",
  description: "Register your Discord server in Etourne database",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      await interactionHandler.processing();

      const hasAuditLogPermission =
        interaction.guild!.members.me?.permissions.has("VIEW_AUDIT_LOG");

      if (await checkServerExists({ discordServerId: interaction.guild!.id })) {
        const alreadyRegisteredEmbed = createServerAlreadyRegisteredEmbed();
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

        await addServer({
          discordServerId: interaction.guild!.id,
          name: interaction.guild!.name,
        });

        await checkAddUser({
          username: log.executor.username,
          discordServerId: interaction.guild!.id,
          discordUserId: log.executor.id,
          roleId: 3,
        });

        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("Discord server registered!").Success)
          .editReply();
      } else {
        const requiredPermissionsEmbed = createRequiredBotPermissionsEmbed();
        return interactionHandler.embeds(requiredPermissionsEmbed).editReply();
      }
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler.embeds(new CustomMessageEmbed().defaultErrorTitle().Error).editReply(),
      );
    }
  },
};

export default registerServer;
