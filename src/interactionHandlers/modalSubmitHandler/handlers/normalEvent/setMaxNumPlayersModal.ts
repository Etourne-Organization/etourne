import { Client, MessageEmbed, ModalSubmitInteraction } from "discord.js";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import BOT_CONFIGS from "botConfig";
import { setColumnValue } from "supabaseDB/methods/events";
import { ModalSubmit } from "../../type";

const setMaxNumPlayersModal: ModalSubmit = {
  customId: "maxNumPlayersModalSubmit",
  run: async (client: Client, interaction: ModalSubmitInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      const eventId = interaction.message?.embeds[0].footer?.text.split(": ")[1] || "";

      const maxNumPlayers: string = interaction.fields.getTextInputValue("maxNumPlayersInput");

      setColumnValue({
        data: [
          {
            key: "maxNumPlayers",
            value: parseInt(maxNumPlayers),
            id: parseInt(eventId),
          },
        ],
      });

      interaction.message?.embeds[0].fields?.find((r) => {
        if (r.name.includes("Registered players")) {
          const numRegisteredPlayers = r.name.split(" ")[2].split("/")[0];
          r.name = `Registered players ${numRegisteredPlayers}/${maxNumPlayers}`;

          if (!r.value) {
            r.value = " ";
          }
        }
      });

      const editedEmbed = new MessageEmbed()
        .setColor(BOT_CONFIGS.color.default)
        .setTitle(interaction.message?.embeds[0].title || "Undefined")
        .setDescription(interaction.message?.embeds[0].description || "Undefined")
        .addFields(interaction.message?.embeds[0].fields || [])
        .setFooter({ text: `Event ID: ${eventId}` });

      await interactionHandler.embeds(editedEmbed).editReply();

      return interactionHandler
        .embeds(new CustomMessageEmbed().setTitle("Max num of players set successfully!").Success)
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

export default setMaxNumPlayersModal;
