import { Client, ModalSubmitInteraction } from "discord.js";

import modalSubmitFunctionList from "./modalSubmitList";

export default async (client: Client, interaction: ModalSubmitInteraction): Promise<void> => {
  const { customId } = interaction;

  const modalSubmitFunction = modalSubmitFunctionList.find((modal) => {
    const temp = customId.split("-");

    if (temp.indexOf(modal.customId) !== -1) {
      return modal;
    }
  });

  if (!modalSubmitFunction) {
    return;
  }

  await modalSubmitFunction.run(client, interaction);
};
