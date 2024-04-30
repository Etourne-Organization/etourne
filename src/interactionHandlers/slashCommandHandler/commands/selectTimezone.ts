import {
  BaseCommandInteraction,
  Client,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
} from "discord.js";
import momentTimzone from "moment-timezone";
import BOT_CONFIGS from "botConfig";

import InteractionHandler from "utils/interactions/interactionHandler";
import { Command } from "../type";

const selectTimezone: Command = {
  name: "selecttimezone",
  description: "Set your timezone",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      //  all timezones
      const allTimezones: {
        label: string;
        value: string;
        description: string;
      }[] = momentTimzone.tz.names().map((tz) => {
        return {
          label: tz,
          description: tz,
          value: tz,
        };
      });

      // select menu
      const selectMenu = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId("timezone-select")
          .setPlaceholder("Select your timezone")
          // .addOptions([
          // 	{
          // 		label: 'America/Toronto',
          // 		description: 'America/Toronto',
          // 		value: 'first_option',
          // 	},
          // 	{
          // 		label: 'America/Toronto',
          // 		description: 'America/Toronto',
          // 		value: 'first_options',
          // 	},
          // ]),
          .addOptions(allTimezones),
      );

      // embed
      const embed = new MessageEmbed()
        .setColor(BOT_CONFIGS.color.default)
        .setTitle("Select your timezone");

      await interactionHandler.embeds(embed).reply({
        components: [selectMenu],
      });

      client.on("interactionCreate", async (i) => {
        if (i.isSelectMenu()) {
          await i.reply({
            content: "You selected your timezone!",
            ephemeral: true,
          });
        }
      });
    } catch (err) {
      console.log({
        actualError: err,
        message: "Something went wrong in selectTimezone.ts",
      });
    }
  },
};

export default selectTimezone;
