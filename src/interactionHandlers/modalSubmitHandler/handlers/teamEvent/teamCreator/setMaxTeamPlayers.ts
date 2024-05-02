import { Client, ModalSubmitInteraction } from "discord.js";

import { findFooterEventId, updateEmbed } from "src/interactionHandlers/utils";
import { setColumnValue } from "supabaseDB/methods/events";
import getMessageEmbed from "utils/getMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ModalSubmit } from "../../../type";
import { TEAM_CREATOR_FIELD_NAMES } from "../../../utils/constants";
import updateAllTeamInfo from "./updateRelatedModals";

const setMaxNumTeamPlayersModal: ModalSubmit = {
  customId: "setMaxNumTeamPlayersModalSubmit",
  run: async (client: Client, interaction: ModalSubmitInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const eventId = findFooterEventId(embed?.footer);

      const newMaxNumTeamPlayers = interaction.fields.getTextInputValue("maxNumTeamPlayers");

      setColumnValue({
        data: [
          {
            key: "maxNumTeamPlayers",
            value: parseInt(newMaxNumTeamPlayers),
            id: parseInt(eventId),
          },
        ],
      });

      embed.fields?.find((field) => {
        if (field.name === TEAM_CREATOR_FIELD_NAMES.maxNumOfTeamPlayers)
          field.value = newMaxNumTeamPlayers;
      });

      const editedEmbed = updateEmbed({
        title: embed.title,
        description: embed.description,
        fields: embed.fields,
        footer: embed.footer,
      });

      updateAllTeamInfo({
        eventId: parseInt(eventId),
        interaction,
        changed: {
          maxNumTeamPlayers: newMaxNumTeamPlayers,
        },
      });

      await interactionHandler.embeds(editedEmbed).editReply();

      return interactionHandler
        .embeds(
          new CustomMessageEmbed().setTitle("Max num of team players set successfully!").Success,
        )
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

export default setMaxNumTeamPlayersModal;
