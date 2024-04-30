import { Client, ModalSubmitInteraction } from "discord.js";

import modalSubmitFunctionList from "./modalSubmitList";

export default async (client: Client, interaction: ModalSubmitInteraction): Promise<void> => {
  const { customId } = interaction;

  const modalSubmitFunction = modalSubmitFunctionList.find((m) => {
    const temp = customId.split("-");

    if (temp.indexOf(m.customId) !== -1) {
      return m;
    }
  });

  if (!modalSubmitFunction) {
    return;
  }

  await modalSubmitFunction.run(client, interaction);
};
