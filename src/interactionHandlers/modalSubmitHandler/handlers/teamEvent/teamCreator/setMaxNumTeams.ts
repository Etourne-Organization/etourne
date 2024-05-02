import { Client, MessageEmbed, ModalSubmitInteraction } from "discord.js";

import BOT_CONFIGS from "botConfig";
import { findFooterEventId, updateEmbed } from "src/interactionHandlers/utils";
import { setColumnValue } from "supabaseDB/methods/events";
import { getNumOfTeams } from "supabaseDB/methods/teams";
import getMessageEmbed from "utils/getMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ModalSubmit } from "../../../type";
import { TEAM_CREATOR_FIELD_NAMES } from "../../../utils/constants";

const setMaxNumTeamsModal: ModalSubmit = {
  customId: "setMaxNumTeamsModalSubmit",
  run: async (client: Client, interaction: ModalSubmitInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const eventId = findFooterEventId(embed?.footer);

      const newMaxNumTeams = interaction.fields.getTextInputValue("maxNumTeams"); // ? Modal value

      const currentNumOfTeams = await getNumOfTeams({ eventId: parseInt(eventId) });

      if (currentNumOfTeams > parseInt(newMaxNumTeams)) {
        const replyEmbed: MessageEmbed = new MessageEmbed()
          .setColor(BOT_CONFIGS.color.red)
          .setTitle(":x: Number of registered teams is more than the new limit")
          .setDescription(
            "Decrease the number of registered teams to set a lower limit than the present value",
          )
          .setTimestamp();

        return interactionHandler.embeds(replyEmbed).followUp();
      }

      setColumnValue({
        data: [
          {
            key: "maxNumTeams",
            value: parseInt(newMaxNumTeams),
            id: parseInt(eventId),
          },
        ],
      });

      embed.fields?.find((field) => {
        if (field.name === TEAM_CREATOR_FIELD_NAMES.maxNumOfTeams) field.value = newMaxNumTeams;
      });

      const editedEmbed = updateEmbed({
        title: embed.title,
        description: embed.description,
        fields: embed.fields,
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
