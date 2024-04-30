import { BaseCommandInteraction, Client } from "discord.js";

import { Command } from "../type";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import COMMAND_IDS from "../../../utils/commandIds";
import { checkServerExists } from "supabaseDB/methods/servers";
import { checkAddUser, checkUserExists } from "supabaseDB/methods/users";

const registerAdmin: Command = {
  name: "registeradmin",
  description: "Register user who added the bot as Admin in Etourne database",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      await interactionHandler.processing();

      if (
        !(await checkServerExists({
          discordServerId: interaction.guild!.id,
        }))
      ) {
        return interactionHandler
          .embeds(
            new CustomMessageEmbed()
              .setTitle("Your server is not registered in Etourne Database!")
              .setDescription(
                `Please register your server by running </registerserver:${COMMAND_IDS.REGISTER_SERVER}>`,
              ).Error,
          )
          .editReply();
      }
      if (
        await checkUserExists({
          discordServerId: interaction.guild!.id,
          discordUserId: interaction.user.id,
        })
      ) {
        return interactionHandler
          .embeds(
            new CustomMessageEmbed().setTitle("You are already registered in Etourne database!")
              .Warning,
          )
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
