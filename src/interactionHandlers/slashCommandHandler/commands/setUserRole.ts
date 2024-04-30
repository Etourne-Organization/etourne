import { BaseCommandInteraction, Client, MessageEmbed, User } from "discord.js";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import BOT_CONFIGS from "botConfig";
import COMMAND_IDS from "../../../utils/commandIds";
import { checkServerExists } from "supabaseDB/methods/servers";
import {
  getUserRole,
  setUserRole as setUserRoleSupabase,
} from "supabaseDB/methods/users";
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
        const embed = new MessageEmbed()
          .setColor(BOT_CONFIGS.color.red)
          .setTitle(":x: Error: Server not registered!")
          .setDescription(
            `Use </registerserver:${COMMAND_IDS.REGISTER_SERVER}> command to register your server in Etourne database.`,
          )
          .setFooter({
            text: "Use /support to seek support if required.",
          })
          .setTimestamp();

        return interactionHandler.embeds(embed).editReply();
      }

      const user: User | null = interaction.options.getUser("user");
      const role = interaction.options.get("role") as unknown as { value: string };

      const userRoleDB = await getUserRole({
        discordUserId: interaction.user.id,
        discordServerId: interaction.guild!.id,
      });

      // only the creator of the bot can run this command with no restriction
      /*
				Checks:
					- If the executor is admin or not: reject if not
			*/
      if (interaction.user.id !== "374230181889572876") {
        if (userRoleDB.length === 0 || userRoleDB[0]["roleId"] !== 3) {
          return interactionHandler
            .embeds(new CustomMessageEmbed().setTitle("You are not allowed run this command!").Error)
            .editReply();
        }
      }

      await setUserRoleSupabase({
        discordServerId: interaction.guild!.id,
        discordUserId: user!.id,
        roleId: parseInt(role.value),
        username: user!.username,
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
