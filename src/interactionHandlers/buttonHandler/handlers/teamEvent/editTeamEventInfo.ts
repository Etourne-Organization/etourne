import {
  ButtonInteraction,
  Client,
  MessageActionRow,
  Modal,
  ModalActionRowComponent,
  TextInputComponent,
} from "discord.js";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { getAllColumnValueById } from "supabaseDB/methods/events";
import { getUserRole } from "supabaseDB/methods/users";
import { ButtonFunction } from "../../type";

const editTeamEventInfo: ButtonFunction = {
  customId: "editTeamEventInfo",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      // check user role in DB
      const userRoleDB = await getUserRole({
        discordUserId: interaction.user.id,
        discordServerId: interaction.guild!.id,
      });

      if (
        userRoleDB.length === 0 ||
        (userRoleDB[0]["roleId"] !== 3 && userRoleDB[0]["roleId"] !== 2)
      ) {
        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("You are not allowed to use this button!").Error)
          .reply();
      }

      const eventId: string = interaction.message.embeds[0].footer?.text.split(": ")[1] || "";

      const allColumnValue = await getAllColumnValueById({ id: parseInt(eventId) });

      const modal = new Modal()
        .setCustomId(`editTeamEventInfoModal-${interaction.id}`)
        .setTitle("Edit event");

      const eventNameInput = new TextInputComponent()
        .setCustomId("eventName")
        .setLabel("Event name")
        .setStyle("SHORT")
        .setPlaceholder("Event name")
        .setValue(allColumnValue[0]["eventName"]);

      const gameNameInput = new TextInputComponent()
        .setCustomId("gameName")
        .setLabel("Game name")
        .setStyle("SHORT")
        .setPlaceholder("Game name")
        .setValue(allColumnValue[0]["gameName"]);

      const eventDateTimeInput = new TextInputComponent()
        .setCustomId("date")
        .setLabel("Date (format: DD/MM/YYYY hour:minute)")
        .setStyle("SHORT")
        .setPlaceholder("Leave empty if changing not required");

      const eventTimezoneInput = new TextInputComponent()
        .setCustomId("timezone")
        .setLabel("Your timezone: timezones.etourne.com")
        .setStyle("SHORT")
        .setPlaceholder("Your timezone")
        .setValue(allColumnValue[0]["timezone"]);

      const eventDescriptionInput = new TextInputComponent()
        .setCustomId("eventDescription")
        .setLabel("Event description")
        .setStyle("PARAGRAPH")
        .setPlaceholder("Event description")
        .setValue(allColumnValue[0]["description"]);

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

export default editTeamEventInfo;
