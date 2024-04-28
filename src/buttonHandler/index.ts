import { ButtonInteraction, Client } from "discord.js";

import buttonList from "./buttonList";
import logFile from "../globalUtils/logFile";

const ButtonHandler = async (client: Client, interaction: ButtonInteraction): Promise<void> => {
  try {
    const { customId } = interaction;

    const buttonFunction = buttonList.find((b) => b.customId === customId);

    if (!buttonFunction) {
      return;
    }

    buttonFunction.run(client, interaction);
  } catch (err) {
    try {
      logFile({
        error: err,
        folder: "buttonHandler",
        file: "index",
      });
    } catch (err) {
      console.log("Error logging failed");
    }
  }
};

export default ButtonHandler;
