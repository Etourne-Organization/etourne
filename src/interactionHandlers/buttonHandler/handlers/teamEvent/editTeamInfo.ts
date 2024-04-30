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
import { checkTeamExists, getAllColumnValueById } from "supabaseDB/methods/teams";
import { getUserRole } from "supabaseDB/methods/users";
import { ButtonFunction } from "../../type";

const editTeamInfo: ButtonFunction = {
  customId: "editTeamInfo",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      const teamId: string = interaction.message.embeds[0].footer?.text.split(" ")[2] || "";

      if (!(await checkTeamExists({ teamId: parseInt(teamId) }))) {
        return interactionHandler
          .embeds(
            new CustomMessageEmbed().setTitle(
              "The team does not exist anymore, maybe it was deleted?",
            ).Warning,
          )
          .reply();
      }

      const teamLeader = interaction.message?.embeds[0].fields?.find(
        (r) => r.name === "Team Leader",
      );

      const userRoleDB = await getUserRole({
        discordUserId: interaction.user.id,
        discordServerId: interaction.guild!.id,
      });

      if (
        interaction.user.username !== teamLeader?.value &&
        (userRoleDB.length === 0 ||
          (userRoleDB[0]["roleId"] !== 3 && userRoleDB[0]["roleId"] !== 2))
      ) {
        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("You are not allowed to use this button!").Error)
          .reply();
      }

      const allColumnValue = await getAllColumnValueById({ id: parseInt(teamId) });

      const teamFormModal = new Modal()
        .setCustomId(`editTeamInfoModal-${interaction.id}`)
        .setTitle("Create Team");

      const teamNameInput = new TextInputComponent()
        .setCustomId("teamName")
        .setLabel("Team Name")
        .setStyle("SHORT")
        .setPlaceholder("Enter team name")
        .setValue(allColumnValue[0]["name"]);

      const teamSmallDescriptionInput = new TextInputComponent()
        .setCustomId("teamShortDescription")
        .setLabel("Team Short Description")
        .setStyle("SHORT")
        .setPlaceholder("Enter short team description")
        .setValue(allColumnValue[0]["description"]);

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
          .embeds(new CustomMessageEmbed().defaultErrorTitle().defaultErrorDescription().Error)
          .reply(),
      );
    }
  },
};

export default editTeamInfo;
