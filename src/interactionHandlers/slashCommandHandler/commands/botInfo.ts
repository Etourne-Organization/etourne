import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";

import BOT_CONFIGS from "botConfig";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { Command } from "../type";
import formatProcessUptime from "../utils/formatProcessUptime";

const botInfo: Command = {
  name: "botinfo",
  description: "Information about the bot",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      const avatar = client.user!.displayAvatarURL();

      const botInfoEmbed = new MessageEmbed()
        .setColor(BOT_CONFIGS.color.default)
        .setThumbnail(avatar)
        .setAuthor({
          name: `${client.user!.username}`,
          iconURL: `${avatar}`,
        })
        .addFields(
          { name: "Bot Tag", value: `${client.user!.username}` },
          { name: "Bot version", value: `1.2` },
          {
            name: "Bot command prefix",
            value: `\`${process.env.PREFIX}\``,
          },

          {
            name: "Server Count",
            value: `${client.guilds.cache.size}`,
          },
        )
        .setFooter({ text: "Creator: mz10ah" })
        .setTimestamp();

      if (interaction.user.id === process.env.OWNER_ID) {
        botInfoEmbed.addFields([
          {
            name: "Time elapsed since last restart",
            value: `${formatProcessUptime(process.uptime())}`,
          },
        ]);
      }
      await interactionHandler.embeds(botInfoEmbed).reply();
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler.embeds(new CustomMessageEmbed().defaultErrorTitle().SHORT.Error).reply(),
      );
    }
  },
};

export default botInfo;
