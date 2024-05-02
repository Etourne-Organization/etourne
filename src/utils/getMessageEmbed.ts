import { APIEmbed } from "discord-api-types/v10";
import { ButtonInteraction, MessageEmbed, ModalSubmitInteraction, SelectMenuInteraction } from "discord.js"; // Import the necessary types
import InteractionHandler from "./interactions/interactionHandler";
import CustomMessageEmbed from "./interactions/messageEmbed";

const getMessageEmbed = <
  T extends ModalSubmitInteraction | SelectMenuInteraction | ButtonInteraction,
>(
  interaction: T,
  interactionHandler?: InteractionHandler,
): MessageEmbed | APIEmbed | null => {
  const embed = interaction.message?.embeds[0];
  if (!embed) {
    if (!interactionHandler) {
      interactionHandler = new InteractionHandler(interaction);
    }
    interactionHandler.embeds(new CustomMessageEmbed().defaultErrorTitle().SHORT.Error).followUp();
    return null;
  }
  return embed;
};

export default getMessageEmbed;
