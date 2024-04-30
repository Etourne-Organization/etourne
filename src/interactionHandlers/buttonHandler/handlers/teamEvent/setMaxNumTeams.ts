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

const setMaxNumTeams: ButtonFunction = {
  customId: "setMaxNumTeams",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      const eventId = interaction.message?.embeds[0].footer?.text.split(": ")[1] || "";

      const maxNumTeamsData = await getColumnValueById({
        id: parseInt(eventId),
        columnName: "maxNumTeams",
      });

      const modal = new Modal()
        .setCustomId(`setMaxNumTeamsModalSubmit-${interaction.id}`)
        .setTitle("Create Team");

      const maxNumTeams = maxNumTeamsData[0].maxNumTeams || 0;

      const maxNumTeamsInput = new TextInputComponent()
        .setCustomId("maxNumTeams")
        .setLabel("Max num of teams")
        .setStyle("SHORT")
        .setPlaceholder("Enter max num of teams")
        .setValue(maxNumTeams.toString());

      const maxNumTeamsLimitActionRow =
        new MessageActionRow<ModalActionRowComponent>().addComponents(maxNumTeamsInput);

      modal.addComponents(maxNumTeamsLimitActionRow);

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

export default setMaxNumTeams;
