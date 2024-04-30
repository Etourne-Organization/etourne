import { Client, SelectMenuInteraction } from "discord.js";

import selectMenuList from "./selectMenuList";

export default async (client: Client, interaction: SelectMenuInteraction): Promise<void> => {
  const { customId } = interaction;

  const selectMenuFunction = selectMenuList.find((b) => b.customId === customId);

  if (!selectMenuFunction) {
    return;
  }

  await selectMenuFunction.run(client, interaction);
};
