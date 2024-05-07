import { Client, ModalSubmitInteraction } from "discord.js";

import { findFooterEventId, updateEmbed, updateEmbedField } from "src/interactionHandlers/utils";
import { getTeamEventCountDB } from "supabaseDB/methods/players";
import { updateEventColumnsDB } from "supabaseDB/methods/columns";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import getMessageEmbed from "utils/interactions/getInteractionEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ModalSubmit } from "../../../type";
import { TEAM_CREATOR_EVENT_TEXT_FIELD } from "src/interactionHandlers/buttonHandler/utils/constants";

const setMaxNumTeamsModal: ModalSubmit = {
  customId: TEAM_CREATOR_EVENT_TEXT_FIELD.SET_MAX_NUM_TEAMS_MODAL_SUBMIT,
  run: async (client: Client, interaction: ModalSubmitInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const eventId = findFooterEventId(embed?.footer);

      const newMaxNumTeams = interaction.fields.getTextInputValue("maxNumTeams");

      const currentNumOfTeams = await getTeamEventCountDB(eventId);

      if (currentNumOfTeams && currentNumOfTeams > parseInt(newMaxNumTeams)) {
        const replyEmbed = new CustomMessageEmbed()
          .setTitle("Number of registered teams is more than the new limit")
          .setDescription(
            "Decrease the number of registered teams to set a lower limit than the present value",
          )
          .setTimestamp().Error;

        return interactionHandler.embeds(replyEmbed).followUp();
      }

      await updateEventColumnsDB(eventId, [
        { key: "maxNumTeams", value: parseInt(newMaxNumTeams) },
      ]);

      const fields = updateEmbedField(embed.fields, {
        maxNumTeams: newMaxNumTeams,
      });

      const editedEmbed = updateEmbed({
        title: embed.title,
        description: embed.description,
        fields,
        footer: embed.footer,
      });

      await interactionHandler.embeds(editedEmbed).editReply();

      return interactionHandler
        .embeds(new CustomMessageEmbed().setTitle("Max num of teams set successfully!").Success)
        .followUp();
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().defaultErrorDescription().Error)
          .followUp(),
      );
    }
  },
};

export default setMaxNumTeamsModal;
