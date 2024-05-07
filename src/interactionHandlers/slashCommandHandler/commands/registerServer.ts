import { BaseCommandInteraction, Client } from "discord.js";

import { USER_ROLES } from "constants/userRoles";
import { validateServerExists } from "src/interactionHandlers/validate";
import { createServerDB } from "supabaseDB/methods/server";
import { checkOrCreateUserDB } from "supabaseDB/methods/users";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { Command } from "../type";
import { createNonAdminEmbed, createRequiredBotPermissionsEmbed } from "../utils/embeds";

const registerServer: Command = {
  name: "registerserver",
  description: "Register your Discord server in Etourne database",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      await interactionHandler.processing();

      if (!interaction.guild || !interaction.guildId)
        return interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().SHORT.Error)
          .editReply();

      const { isValid, embed: alreadyRegisteredEmbed } = await validateServerExists(
        interaction.guildId,
      );
      if (isValid) return interactionHandler.embeds(alreadyRegisteredEmbed!).editReply();

      const hasAuditLogPermission = interaction.guild.members.me?.permissions.has("VIEW_AUDIT_LOG");

      if (hasAuditLogPermission) {
        const fetchedLog = await interaction.guild.fetchAuditLogs({
          type: "BOT_ADD",
          limit: 1,
        });

        const log = fetchedLog.entries.first();

        if (log?.executor?.id !== interaction.user.id)
          return interactionHandler.embeds(createNonAdminEmbed()).editReply();

        // ---- invoking user has passed all permission checks

        const serverId = await createServerDB(interaction.guildId, interaction.guild.name);

        await checkOrCreateUserDB({
          userId: log.executor.id,
          serverId: serverId!,
          username: log.executor.username,
          roleId: USER_ROLES.Admin,
        });

        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("Discord server registered!").Success)
          .editReply();
      }

      const requiredPermissionsEmbed = createRequiredBotPermissionsEmbed();
      return interactionHandler.embeds(requiredPermissionsEmbed).editReply();
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler.embeds(new CustomMessageEmbed().defaultErrorTitle().Error).editReply(),
      );
    }
  },
};

export default registerServer;
