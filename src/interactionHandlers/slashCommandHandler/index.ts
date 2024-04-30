import { BaseCommandInteraction, Client } from "discord.js";

import slashCommandsList from "./slashCommandList";
import CustomMessageEmbed from "utils/interactions/messageEmbed";

const slashCommandHandler = async (
  client: Client,
  interaction: BaseCommandInteraction,
): Promise<void> => {
  const slashCommand = slashCommandsList.find((c) => c.name === interaction.commandName);

  if (!slashCommand) {
    await interaction.reply({
      embeds: [
        new CustomMessageEmbed().setTitle("Oops").setDescription("Could not run slash command").Error,
      ],
    });

    return;
  }

  await slashCommand.run(client, interaction);
};

export default slashCommandHandler;
