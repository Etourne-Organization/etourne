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
import { getNumOfTeams } from "supabaseDB/methods/teams";
import { ButtonFunction } from "../../type";

const createTeam: ButtonFunction = {
  customId: "createTeam",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      const eventId: string = interaction.message.embeds[0].footer?.text.split(": ")[1] || "";

      const maxNumTeams = await getColumnValueById({
        id: parseInt(eventId),
        columnName: "maxNumTeams",
      });

      if (
        maxNumTeams.length > 0 &&
        (await getNumOfTeams({ eventId: parseInt(eventId) })) === maxNumTeams[0]["maxNumTeams"]
      ) {
        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("Number of team has reached the limit!").Warning)
          .reply();
      }

      const teamFormModal = new Modal()
        .setCustomId(`teamModalSubmit-${interaction.id}`)
        .setTitle("Create Team");

      const teamNameInput = new TextInputComponent()
        .setCustomId("teamName")
        .setLabel("Team Name")
        .setStyle("SHORT")
        .setPlaceholder("Enter team name")
        .setRequired(true);

      const teamSmallDescriptionInput = new TextInputComponent()
        .setCustomId("teamShortDescription")
        .setLabel("Team Short Description")
        .setStyle("SHORT")
        .setPlaceholder("Enter short team description")
        .setRequired(true);

      const teamNameActionRow = new MessageActionRow<ModalActionRowComponent>().addComponents(
        teamNameInput,
      );

      const teamSmallDescriptionActionRow =
        new MessageActionRow<ModalActionRowComponent>().addComponents(teamSmallDescriptionInput);

      teamFormModal.addComponents(teamNameActionRow, teamSmallDescriptionActionRow);

      await interaction.showModal(teamFormModal);
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(
            new CustomMessageEmbed().defaultErrorTitle().SHORT.defaultErrorDescription().SHORT.Error,
          )
          .reply(),
      );
    }
  },
};

export default createTeam;
