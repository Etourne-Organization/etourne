import {
  ButtonInteraction,
  Client,
  MessageActionRow,
  Modal,
  ModalActionRowComponent,
  TextInputComponent,
} from "discord.js";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { getColumnValueById } from "supabaseDB/methods/events";
import { ButtonFunction } from "../../type";

const setMaxNumTeamPlayers: ButtonFunction = {
  customId: "setMaxNumTeamPlayers",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      const eventId: string = interaction.message?.embeds[0].footer?.text.split(": ")[1] || "";

      const maxNumTeamPlayersData = await getColumnValueById({
        id: parseInt(eventId),
        columnName: "maxNumTeamPlayers",
      });

      const maxNumTeamPlayers = maxNumTeamPlayersData[0]?.maxNumTeamPlayers || 0;

      const modal = new Modal()
        .setCustomId(`setMaxNumTeamPlayersModalSubmit-${interaction.id}`)
        .setTitle("Create Team");

      const maxNumTeamPlayersInput = new TextInputComponent()
        .setCustomId("maxNumTeamPlayers")
        .setLabel("Max num of team players")
        .setStyle("SHORT")
        .setPlaceholder("Enter max num of team players in each team")
        .setValue(maxNumTeamPlayers.toString());

      const maxNumTeamPlayersActionRow =
        new MessageActionRow<ModalActionRowComponent>().addComponents(maxNumTeamPlayersInput);

      modal.addComponents(maxNumTeamPlayersActionRow);

      await interaction.showModal(modal);
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().defaultErrorDescription().Error)
          .reply(),
      );
    }
  },
};

export default setMaxNumTeamPlayers;
