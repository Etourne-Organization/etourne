import { ButtonInteraction, Client } from "discord.js";

import buttonList from "./buttonList";

const ButtonHandler = async (client: Client, interaction: ButtonInteraction): Promise<void> => {
  const { customId } = interaction;

  const buttonFunction = buttonList.find((b) => b.customId === customId);

  if (!buttonFunction) {
    return;
  }

  await buttonFunction.run(client, interaction);
};

export default ButtonHandler;
