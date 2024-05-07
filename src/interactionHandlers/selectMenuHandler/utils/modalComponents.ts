import { MessageActionRow, Modal, ModalActionRowComponent, TextInputComponent } from "discord.js";
import {
  EVENT_TYPE_TEXT_FIELD,
  NORMAL_CREATOR_EVENT_TEXT_FIELD,
  TEAM_CREATOR_EVENT_TEXT_FIELD,
} from "src/interactionHandlers/buttonHandler/utils/constants";

export function createEventTypeModal(eventType: string, interactionId: string) {
  const modal = new Modal()
    .setCustomId(
      `${
        eventType === "createEvent"
          ? NORMAL_CREATOR_EVENT_TEXT_FIELD.NORMAL_EVENT_MODAL_SUBMIT
          : TEAM_CREATOR_EVENT_TEXT_FIELD.TEAM_EVENT_MODAL_SUBMIT
      }-${interactionId}`,
    )
    .setTitle("Create Event");

  const eventNameInput = new TextInputComponent()
    .setCustomId(EVENT_TYPE_TEXT_FIELD.EVENT_NAME)
    .setLabel("Event name")
    .setStyle("SHORT")
    .setPlaceholder("Event name")
    .setRequired(true);

  const gameNameInput = new TextInputComponent()
    .setCustomId(EVENT_TYPE_TEXT_FIELD.GAME_NAME)
    .setLabel("Game name")
    .setStyle("SHORT")
    .setPlaceholder("Game name")
    .setRequired(true);

  const eventDateTimeInput = new TextInputComponent()
    .setCustomId(EVENT_TYPE_TEXT_FIELD.DATETIME)
    .setLabel("Date (format: DD/MM/YYYY HH:mm)")
    .setStyle("SHORT")
    .setPlaceholder("Event date and time")
    .setRequired(true);

  const eventTimezoneInput = new TextInputComponent()
    .setCustomId(EVENT_TYPE_TEXT_FIELD.TIMEZONE)
    .setLabel("Your timezone: timezones.etourne.com")
    .setStyle("SHORT")
    .setPlaceholder("Your timezone")
    .setRequired(true);

  const eventDescriptionInput = new TextInputComponent()
    .setCustomId(EVENT_TYPE_TEXT_FIELD.EVENT_DESCRIPTION)
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

  const eventDescriptionActionRow = new MessageActionRow<ModalActionRowComponent>().addComponents(
    eventDescriptionInput,
  );

  modal.addComponents(
    eventNameActionRow,
    gameNameActionRow,
    eventTimezoneActionRow,
    eventDateTimeActionRow,
    eventDescriptionActionRow,
  );

  return modal;
}
