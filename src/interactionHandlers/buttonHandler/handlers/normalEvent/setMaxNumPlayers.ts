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

const setMaxNumPlayers: ButtonFunction = {
  customId: "setMaxNumPlayers",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      const eventId: string = interaction.message.embeds[0].footer?.text.split(": ")[1] || "";

      const maxNumPlayers = await getColumnValueById({
        id: parseInt(eventId),
        columnName: "maxNumPlayers",
      });

      const modal = new Modal()
        .setCustomId(`maxNumPlayersModalSubmit-${interaction.id}`)
        .setTitle("Set max number of players");

      const input = new TextInputComponent()
        .setCustomId("maxNumPlayersInput")
        .setLabel("Num of players limit")
        .setStyle("SHORT")
        .setPlaceholder("Enter limit for num of players")
        .setValue(
          maxNumPlayers[0]["maxNumPlayers"] ? maxNumPlayers[0]["maxNumPlayers"].toString() : "",
        );

      const teamMemberLimitNumActionRow =
        new MessageActionRow<ModalActionRowComponent>().addComponents(input);

      modal.addComponents(teamMemberLimitNumActionRow);

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

export default setMaxNumPlayers;
