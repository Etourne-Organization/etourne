import { BaseCommandInteraction, Client } from "discord.js";

import { Command } from "../type";

import { USER_ROLES } from "constants/userRoles";
import { validateServerExists, validateUserExists } from "src/interactionHandlers/validate";
import { checkOrCreateUserDB } from "supabaseDB/methods/users";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { createNonAdminEmbed } from "../utils/embeds";

const registerAdmin: Command = {
  name: "registeradmin",
  description: "Register user who added the bot as Admin in Etourne database",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      await interactionHandler.processing();

      if (!interaction.guild || !interaction.guildId)
        return interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().SHORT.Error)
          .editReply();

      const {
        isValid,
        embed: notRegisteredEmbed,
        value: serverId,
      } = await validateServerExists(interaction.guildId);

      if (!isValid) return interactionHandler.embeds(notRegisteredEmbed).editReply();

      const { isValid: isUserValid, embed: userExistsEmbed } = await validateUserExists(
        serverId,
        interaction.user.id,
      );
      if (isUserValid) return interactionHandler.embeds(userExistsEmbed!).editReply();

      const hasAuditLogPermission =
        interaction.guild!.members.me?.permissions.has("VIEW_AUDIT_LOG");

      if (hasAuditLogPermission) {
        const fetchedLog = await interaction.guild!.fetchAuditLogs({
          type: "BOT_ADD",
          limit: 1,
        });

        const log = fetchedLog.entries.first();

        if (log?.executor!.id !== interaction.user.id)
          return interactionHandler.embeds(createNonAdminEmbed()).editReply();

        await checkOrCreateUserDB({
          userId: log.executor.id,
          serverId,
          username: log.executor.username,
          roleId: USER_ROLES.Admin,
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
