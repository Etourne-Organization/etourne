import { Client, Interaction } from "discord.js";

import slashCommandHandler from "../interactionHandlers/slashCommandHandler";

import ButtonHandler from "src/interactionHandlers/buttonHandler";
import { throwFormattedErrorLog } from "utils/logging/errorFormats";
import logError from "utils/logging/logError";
import modalSubmitHandler from "../interactionHandlers/modalSubmitHandler";
import selectMenuHandler from "../interactionHandlers/selectMenuHandler";

/**
 * Registers event listeners for various types of interactions
 */
const registerInteractionHandlers = (client: Client): void => {
  // Sets up an event listener for interaction events
  client.on("interactionCreate", async (interaction: Interaction) => {
    try {
      // Check if the interaction is a slash command or a context menu command.
      if (interaction.isCommand() || interaction.isContextMenu()) {
        await slashCommandHandler(client, interaction); // Handle slash commands
      }

      // Check if the interaction is a button press.
      if (interaction.isButton()) {
        await ButtonHandler(client, interaction); // Handle button interactions
      }

      // Check if the interaction is a modal submission.
      if (interaction.isModalSubmit()) {
        await modalSubmitHandler(client, interaction); // Handle modal submissions
      }

      // Check if the interaction is a select menu interaction.
      if (interaction.isSelectMenu()) {
        await selectMenuHandler(client, interaction); // Handle select menu interactions
      }
    } catch (error) {
      logError(throwFormattedErrorLog(error));
    }
  });
};

export default registerInteractionHandlers;
