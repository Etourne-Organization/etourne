import {
  BaseCommandInteraction,
  Client,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
} from "discord.js";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import BOT_CONFIGS from "botConfig";
import COMMAND_IDS from "../../../utils/commandIds";
import { checkServerExists } from "supabaseDB/methods/servers";
import { getUserRole } from "supabaseDB/methods/users";
import { Command } from "../type";

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
        const embed = new MessageEmbed()
          .setColor(BOT_CONFIGS.color.red)
          .setTitle(":x: Error: Server not registered!")
          .setDescription(
            `Use </registerserver:${COMMAND_IDS.REGISTER_SERVER}> command to register your server in Etourne database.`,
          )
          .setFooter({ text: "Use /support to seek support if required." })
          .setTimestamp();

        return interactionHandler.embeds(embed).editReply();
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
          .embeds(new CustomMessageEmbed().setTitle("You are not allowed to run this command!").Error)
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
        .embeds(new CustomMessageEmbed().setTitle("Select event type you would like to create").Info)
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
