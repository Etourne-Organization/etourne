import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import BOT_CONFIGS from "botConfig";
import COMMAND_IDS from "../../../utils/commandIds";
import { Command } from "../type";

const help: Command = {
  name: "help",
  description: "Help embed to see all the commands",
  type: "CHAT_INPUT",
  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      const member: string = interaction.user.username;

      const helpEmbed = new MessageEmbed()
        .setColor(BOT_CONFIGS.color.default)
        .setTitle(`:question: Help`)
        .setDescription("Here is the list of commands you can use")
        .setThumbnail(`${client.user?.displayAvatarURL()}`)
        .addFields(
          {
            name: ":information_source:  Bot Info",
            value: `Get more information about the bot: </botinfo:${COMMAND_IDS.BOT_INFO}>`,
          },
          {
            name: ":pencil:  Register Server",
            value: `Register your Discord server in Etourne database: </registerserver:${COMMAND_IDS.REGISTER_SERVER}>`,
          },
          {
            name: ":pencil:  Register Admin",
            value: `Register user who added the bot as Admin in Etourne database: </registeradmin:${COMMAND_IDS.REGISTER_ADMIN}>`,
          },
          {
            name: ":rocket:  Get started",
            value: `Get started with using Etourne: </getstarted:${COMMAND_IDS.GET_STARTED}>`,
          },
          {
            name: ":calendar_spiral:  Create event",
            value: `Create event, team or no team: </createevent:${COMMAND_IDS.CREATE_EVENT}>`,
          },
          // {
          // 	name: ':calendar_spiral:  Create event',
          // 	value: `Create event (no-team): </createevent:${commandIds.CREATE_EVENT}>`,
          // },
          // {
          // 	name: ':calendar_spiral:  Create team event',
          // 	value: `Create team event: </createteamevent:${commandIds.CREATE_TEAM_EVENT}>`,
          // },
          {
            name: ":mag_right:  Get event",
            value: `Get event from database: </getevent:${COMMAND_IDS.GET_EVENT}>`,
          },
          {
            name: ":notepad_spiral:  List server events",
            value: `List all the events being hosted in the server: </listserverevents:${COMMAND_IDS.LIST_SERVER_EVENTS}>`,
          },
          {
            name: ":pencil2:  Set user role",
            value: `Set role of a user: </setuserrole:${COMMAND_IDS.SET_USER_ROLE}>`,
          },
          {
            name: ":thought_balloon:  Feedback",
            value: `Share feedback and ideas or raise issues: </feedback:${COMMAND_IDS.FEEDBACK}>`,
          },
          {
            name: ":tools:  Request Support",
            value: `Request for support whenever you are facing issues: </requestsupport:${COMMAND_IDS.REQUEST_SUPPORT}>`,
          },
        )
        .setTimestamp()
        .setFooter({ text: `Requested by: ${member}` });

      await interactionHandler.embeds(helpEmbed).reply();
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler.embeds(new CustomMessageEmbed().defaultErrorTitle().Error).reply(),
      );
    }
  },
};

export default help;
