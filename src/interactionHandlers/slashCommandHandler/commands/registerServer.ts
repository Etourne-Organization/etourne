import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import BOT_CONFIGS from "botConfig";
import { addServer, checkServerExists } from "supabaseDB/methods/servers";
import { checkAddUser } from "supabaseDB/methods/users";
import { Command } from "../type";

const registerServer: Command = {
  name: "registerserver",
  description: "Register your Discord server in Etourne database",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      await interactionHandler.processing();

      if (await checkServerExists({ discordServerId: interaction.guild!.id })) {
        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("Your server is already registered!").Warning)
          .editReply();
      } else if (interaction.guild!.members.me?.permissions.has("VIEW_AUDIT_LOG")) {
        const fetchedLog = await interaction.guild!.fetchAuditLogs({
          type: "BOT_ADD",
          limit: 1,
        });

        const log = fetchedLog.entries.first();

        if (log?.executor!.id !== interaction.user.id) {
          return interactionHandler
            .embeds(
              new CustomMessageEmbed().setTitle(
                "You are not the user who added the bot into this server!",
              ).Error,
            )
            .editReply();
        }

        await addServer({
          discordServerId: interaction.guild!.id,
          name: interaction.guild!.name,
        });

        await checkAddUser({
          username: log!.executor!.username,
          discordServerId: interaction.guild!.id,
          discordUserId: log!.executor!.id,
          roleId: 3,
        });
        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("Discord server registered!").Success)
          .editReply();
      } else {
        const embed = new MessageEmbed()
          .setColor(BOT_CONFIGS.color.red)
          .setTitle(":x: Error")
          .setDescription(
            "Please give the following permission to the bot: \n - `View Audit Log` \n \n## Why is this needed? \n This permission will allow the bot to retrieve the user who added the bot and make that user `Admin` (**NOT** server `Admin`) in Etourne software.",
          )
          .setTimestamp();
        return interactionHandler.embeds(embed).editReply();
      }
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler.embeds(new CustomMessageEmbed().defaultErrorTitle().Error).editReply(),
      );
    }
  },
};

export default registerServer;
