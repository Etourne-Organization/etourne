import { Client, MessageEmbed, ModalSubmitInteraction } from "discord.js";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import BOT_CONFIGS from "botConfig";
import { setColumnValue } from "supabaseDB/methods/events";
import { getNumOfTeams } from "supabaseDB/methods/teams";
import { ModalSubmit } from "../../type";

const setMaxNumTeamsModal: ModalSubmit = {
  customId: "setMaxNumTeamsModalSubmit",
  run: async (client: Client, interaction: ModalSubmitInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      const eventId = interaction.message?.embeds[0].footer?.text.split(": ")[1] || "";

      const maxNumTeams = interaction.fields.getTextInputValue("maxNumTeams");

      const numOfTeams = await getNumOfTeams({ eventId: parseInt(eventId) });

      if (numOfTeams > parseInt(maxNumTeams)) {
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
            value: parseInt(maxNumTeams),
            id: parseInt(eventId),
          },
        ],
      });

      interaction.message?.embeds[0].fields?.find((r) => {
        if (r.name === "Max num of teams") {
          r.value = maxNumTeams;
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
