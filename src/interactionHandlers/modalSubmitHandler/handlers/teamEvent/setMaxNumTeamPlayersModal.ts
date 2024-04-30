import { Client, MessageEmbed, ModalSubmitInteraction } from "discord.js";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import BOT_CONFIGS from "botConfig";
import { setColumnValue } from "supabaseDB/methods/events";
import updateAllTeamInfo from "./utils/updateAllTeamInfo";
import { ModalSubmit } from "../../type";

const setMaxNumTeamPlayersModal: ModalSubmit = {
  customId: "setMaxNumTeamPlayersModalSubmit",
  run: async (client: Client, interaction: ModalSubmitInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      const eventId = interaction.message?.embeds[0].footer?.text.split(": ")[1] || "";

      const maxNumTeamPlayers: string = interaction.fields.getTextInputValue("maxNumTeamPlayers");

      setColumnValue({
        data: [
          {
            key: "maxNumTeamPlayers",
            value: parseInt(maxNumTeamPlayers),
            id: parseInt(eventId),
          },
        ],
      });

      interaction.message?.embeds[0].fields?.find((r) => {
        if (r.name === "Max num of team players") {
          r.value = maxNumTeamPlayers;
        }
      });

      const editedEmbed = new MessageEmbed()
        .setColor(BOT_CONFIGS.color.default)
        .setTitle(interaction.message?.embeds[0].title || "Undefined")
        .setDescription(interaction.message?.embeds[0].description || "Undefined")
        .addFields(interaction.message?.embeds[0].fields || [])
        .setFooter({ text: `Event ID: ${eventId}` });

      updateAllTeamInfo({ eventId: parseInt(eventId), interaction });

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
