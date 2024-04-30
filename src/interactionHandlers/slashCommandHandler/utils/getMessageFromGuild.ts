import { BaseCommandInteraction, Message } from "discord.js";

const getMessageFromGuild = async (
  interaction: BaseCommandInteraction,
  messageId: string,
): Promise<Message | null> => {
  const textChannels = interaction.guild!.channels.cache.filter(
    (channel) => channel.type === "GUILD_TEXT",
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_, channel] of textChannels) {
    try {
      const message = await channel.messages!.fetch(messageId);
      if (message) {
        return message;
      }
    } catch (error) {
      // Silently ignore errors
    }
  }

  return null;
};

export default getMessageFromGuild;
