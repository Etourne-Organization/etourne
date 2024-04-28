import { Client, Interaction } from "discord.js";

import slashCommandHandler from "../slashCommands";

import modalSubmitHandler from "../modalSubmitHandler";
import selectMenuHandler from "../selectMenuHandler";
import logError from "src/globalUtils/logError";
import ButtonHandler from "src/buttonHandler";

export default (client: Client): void => {
  try {
    client.on("interactionCreate", async (interaction: Interaction) => {
      if (interaction.isCommand() || interaction.isContextMenu()) {
        await slashCommandHandler(client, interaction);
      }

      if (interaction.isButton()) {
        await ButtonHandler(client, interaction);
      }

      if (interaction.isModalSubmit()) {
        await modalSubmitHandler(client, interaction);
      }

      if (interaction.isSelectMenu()) {
        await selectMenuHandler(client, interaction);
      }
    });
  } catch (err) {
    logError(err);
  }
};
