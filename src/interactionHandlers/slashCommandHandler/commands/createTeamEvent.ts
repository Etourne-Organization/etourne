import { BaseCommandInteraction, Client } from "discord.js";

import { checkServerExists } from "supabaseDB/methods/servers";
import { getUserRole } from "supabaseDB/methods/users";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { Command } from "../type";
import { createCannotRunCommandEmbed, createServerNotRegisteredEmbed } from "../utils/embeds";
import { createEventInfoComponents } from "../utils/modalComponents";

const createTeamEvent: Command = {
  name: "createteamevent",
  description: "Create team event",
  type: "CHAT_INPUT",

  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      if (
        !(await checkServerExists({
          discordServerId: interaction.guild!.id,
        }))
      ) {
        const notRegisteredEmbed = createServerNotRegisteredEmbed();
        return interactionHandler.embeds(notRegisteredEmbed).reply();
      }

      const userRoleDB = await getUserRole({
        discordUserId: interaction.user.id,
        discordServerId: interaction.guild!.id,
      });

      if (
        userRoleDB.length === 0 ||
        (userRoleDB[0]["roleId"] !== 3 && userRoleDB[0]["roleId"] !== 2)
      ) {
        const notAllowedEmbed = createCannotRunCommandEmbed();
        return interactionHandler.embeds(notAllowedEmbed).editReply();
      }

      const modal = createEventInfoComponents(interaction.id);

      await interaction.showModal(modal);
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().defaultErrorDescription().Error)
          .reply(),
      );
    }
  },
};

export default createTeamEvent;
