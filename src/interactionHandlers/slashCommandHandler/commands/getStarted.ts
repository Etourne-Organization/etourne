import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";

import BOT_CONFIGS from "botConfig";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import COMMAND_IDS from "../../../utils/commandIds";
import { Command } from "../type";

const getStarted: Command = {
  name: "getstarted",
  description: "Get started with using Etourne bot",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      const embed = new MessageEmbed()
        .setColor(BOT_CONFIGS.color.default)
        .setThumbnail(`${client.user?.displayAvatarURL()}`)
        .setTitle("")
        .setDescription(
          `# :rocket: Get started\nThank you for choosing Etourne.\n\nIn summary, Etourne aims to make the process of creating and managing events and tournaments much easier with simple commands and buttons (as well as [web app](https://etourne.com) - currently in beta).\n\n## Etourne has 3 roles:\n• __Player__: Default role of every user in the sever to register for any event and create teams.\n• __Manager__: Event manager with the permission to create and manage events, teams and players.\n• __Admin__: Admin with all the privileges of \`manager\` and \`player\` with additional permisson which is </setuserrole:${COMMAND_IDS.SET_USER_ROLE}>. User who adds the bot gets this role by default.\n\n## To get started:\n• Use </createevent:${COMMAND_IDS.CREATE_EVENT}> to start creating events.\n• Use </createteamevent:${COMMAND_IDS.CREATE_TEAM_EVENT}> to start creating team events.\n• Use </help:${COMMAND_IDS.HELP}> to find out other commands you can use.\n\n**Note:** Double check whether your Discord server is registered in Etourne database by using </registerserver:${COMMAND_IDS.REGISTER_SERVER}> \n \n## To share any feedback or report bugs:\nUse </feedback:${COMMAND_IDS.FEEDBACK}> \n \n## To get support:\nUse </requestsupport:${COMMAND_IDS.REQUEST_SUPPORT}>`,
        )
        .setFooter({ text: `Requested by: ${interaction.user.username}` })
        .setTimestamp();

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

export default getStarted;
