import { BaseCommandInteraction, Client } from "discord.js";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { Command } from "../type";

const getStarted: Command = {
  name: "getstarted",
  description: "Get started with using Etourne bot",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      const embed = new CustomMessageEmbed("")
        .setThumbnail(client.user?.displayAvatarURL() ?? "")
        .setDescription(
          `# :rocket: Get started\n` +
            `\nThank you for choosing Etourne.\n` +
            `\nEtourne aims to make creating and managing events easier with simple commands and buttons, as well as through our [web app](https://etourne.com) thats currently in beta.\n` +
            `\n## Etourne Roles:\n` +
            `- **Player**: Default role to register for events and create teams.\n` +
            `- **Manager**: Can create and manage events, teams, and players.\n` +
            `- **Admin**: All Manager privileges with additional permissions, including \`/setuserrole\`. This role is assigned by default to the bot creator.\n` +
            `\n## Getting Started:\n` +
            `- Use \`/createevent\` to create events (normal or team events).\n` +
            `- Use \`/help\` for additional commands.\n` +
            `\n**Note:** Double-check if your Discord server is registered with Etourne using \`/registerserver\`.\n` +
            `\n## For Feedback or Bug Reporting:\n` +
            `Use \`/feedback\`.\n` +
            `\n## For Support:\n` +
            `Use \`/requestsupport\`.\n`,
        )
        .setFooter({ text: `Requested by: ${interaction.user.username}` })
        .setTimestamp().Info;

      await interactionHandler.embeds(embed).reply();
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().SHORT.Error)
          .editReply(),
      );
    }
  },
};

export default getStarted; // Export the command
