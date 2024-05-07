import { Client, Interaction } from "discord.js";

import slashCommandHandler from "../interactionHandlers/slashCommandHandler";

import ButtonHandler from "src/interactionHandlers/buttonHandler";
import { throwFormattedErrorLog } from "utils/logging/errorFormats";
import logError from "utils/logging/logError";
import modalSubmitHandler from "../interactionHandlers/modalSubmitHandler";
import selectMenuHandler from "../interactionHandlers/selectMenuHandler";

/**
 * Registers event listeners for various types of interaction events
 */
const registerInteractionHandlers = (client: Client): void => {
  client.on("interactionCreate", async (interaction: Interaction) => {
    try {
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
    } catch (error) {
      logError(throwFormattedErrorLog(error));
    }
  });
};

export default registerInteractionHandlers;
