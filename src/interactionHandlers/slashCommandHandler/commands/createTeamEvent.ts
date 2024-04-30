import {
  BaseCommandInteraction,
  Client,
  MessageActionRow,
  MessageEmbed,
  Modal,
  ModalActionRowComponent,
  TextInputComponent,
} from "discord.js";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import BOT_CONFIGS from "botConfig";
import COMMAND_IDS from "../../../utils/commandIds";
import { checkServerExists } from "supabaseDB/methods/servers";
import { getUserRole } from "supabaseDB/methods/users";
import { Command } from "../type";

const createTeamEvent: Command = {
  name: "createteamevent",
  description: "Create team event",
  type: "CHAT_INPUT",

  run: async (client: Client, interaction: BaseCommandInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      if (
        !(await checkServerExists({
          discordServerId: interaction.guild!.id,
        }))
      ) {
        const embed = new MessageEmbed()
          .setColor(BOT_CONFIGS.color.red)
          .setTitle(":x: Error: Server not registered!")
          .setDescription(
            `Use </registerserver:${COMMAND_IDS.REGISTER_SERVER}> command to register your server in Etourne database.`,
          )
          .setFooter({ text: "Use /support to seek support if required." })
          .setTimestamp();
        return interactionHandler.embeds(embed).reply();
      }

      const userRoleDB = await getUserRole({
        discordUserId: interaction.user.id,
        discordServerId: interaction.guild!.id,
      });

      if (
        userRoleDB.length === 0 ||
        (userRoleDB[0]["roleId"] !== 3 && userRoleDB[0]["roleId"] !== 2)
      ) {
        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("You are not allowed to run this command!").Error)
          .editReply();
      }

      /* modal */
      const modal = new Modal()
        .setCustomId(`teamEventModalSubmit-${interaction.id}`)
        .setTitle("Create Team Event");

      const eventNameInput = new TextInputComponent()
        .setCustomId("eventName")
        .setLabel("Event name")
        .setStyle("SHORT")
        .setPlaceholder("Event name")
        .setRequired(true);

      const gameNameInput = new TextInputComponent()
        .setCustomId("gameName")
        .setLabel("Game name")
        .setStyle("SHORT")
        .setPlaceholder("Game name")
        .setRequired(true);

      const eventDateTimeInput = new TextInputComponent()
        .setCustomId("date")
        .setLabel("Date (format: DD/MM/YYYY hour:minute)")
        .setStyle("SHORT")
        .setPlaceholder("Event date and time")
        .setRequired(true);

      const eventTimezoneInput = new TextInputComponent()
        .setCustomId("timezone")
        .setLabel("Your timezone: timezones.etourne.com")
        .setStyle("SHORT")
        .setPlaceholder("Your timezone")
        .setRequired(true);

      const eventDescriptionInput = new TextInputComponent()
        .setCustomId("eventDescription")
        .setLabel("Event description")
        .setStyle("PARAGRAPH")
        .setPlaceholder("Event description")
        .setRequired(true);

      const eventNameActionRow = new MessageActionRow<ModalActionRowComponent>().addComponents(
        eventNameInput,
      );

      const gameNameActionRow = new MessageActionRow<ModalActionRowComponent>().addComponents(
        gameNameInput,
      );

      const eventTimezoneActionRow = new MessageActionRow<ModalActionRowComponent>().addComponents(
        eventTimezoneInput,
      );

      const eventDateTimeActionRow = new MessageActionRow<ModalActionRowComponent>().addComponents(
        eventDateTimeInput,
      );

      const eventDescriptionActionRow =
        new MessageActionRow<ModalActionRowComponent>().addComponents(eventDescriptionInput);

      modal.addComponents(
        eventNameActionRow,
        gameNameActionRow,
        eventTimezoneActionRow,
        eventDateTimeActionRow,
        eventDescriptionActionRow,
      );

      await interaction.showModal(modal);
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().defaultErrorDescription().Error)
          .reply(),
      );
    }
  },
};

export default createTeamEvent;
