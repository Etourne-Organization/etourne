import {
	ButtonInteraction,
	Client,
	MessageActionRow,
	MessageEmbed,
	MessageSelectMenu,
} from "discord.js";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import BOT_CONFIGS from "botConfig";
import { getAllPlayers } from "supabaseDB/methods/singlePlayers";
import { getUserRole } from "supabaseDB/methods/users";
import { ButtonFunction } from "../../type";

const removePlayer: ButtonFunction = {
  customId: "removePlayer",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interactionHandler.processing();

      // check user role in DB
      const userRoleDB = await getUserRole({
        discordUserId: interaction.user.id,
        discordServerId: interaction.guild!.id,
      });

      if (
        userRoleDB.length === 0 ||
        (userRoleDB[0]["roleId"] !== 3 && userRoleDB[0]["roleId"] !== 2)
      ) {
        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("You are not allowed to use this button!").Error)
          .editReply();
      }

      const footer = interaction.message.embeds[0].footer?.text;
      const eventId = interaction.message.embeds[0].footer?.text.split(": ")[1] || "";

      const players = await getAllPlayers({
        eventId: parseInt(eventId),
      });

      if (!(players!.length > 0))
        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("There are no players to remove!").Error)
          .editReply();

      const selectMenuOptions: Array<{
        label: string;
        description: string;
        value: string;
      }> = [];

      for (const player of players) {
        if (player?.username === interaction.user.username) return;

        selectMenuOptions.push({
          label: player?.username || "",
          description: `Remove ${player?.username}`,
          value: `${player?.username}||${player?.userId}`,
        });
      }

      const selectMenu = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("removePlayer")
          .setPlaceholder("Select a player to be removed")
          .addOptions(selectMenuOptions),
      );

      const selectMessageEmbed = new MessageEmbed()
        .setTitle("Select team player to be removed")
        .setColor(BOT_CONFIGS.color.default)
        .setFooter({ text: `${footer}` })
        .setTimestamp();

      await interactionHandler.embeds(selectMessageEmbed).editReply({
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

export default removePlayer;
