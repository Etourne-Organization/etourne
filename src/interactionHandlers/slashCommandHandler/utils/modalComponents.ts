import { MessageActionRow, Modal, ModalActionRowComponent, TextInputComponent } from "discord.js";
import { TEAM_CREATOR_EVENT_TEXT_FIELD } from "src/interactionHandlers/buttonHandler/utils/constants";

export function createTeamCreatorComponents(interactionId: string) {
  /* modal */
  const modal = new Modal()
    .setCustomId(`${TEAM_CREATOR_EVENT_TEXT_FIELD.TEAM_EVENT_MODAL_SUBMIT}-${interactionId}`)
    .setTitle("Create Team Event");

  const eventNameInput = new TextInputComponent()
    .setCustomId(TEAM_CREATOR_EVENT_TEXT_FIELD.EVENT_NAME)
    .setLabel("Event name")
    .setStyle("SHORT")
    .setPlaceholder("Event name")
    .setRequired(true);

  const gameNameInput = new TextInputComponent()
    .setCustomId(TEAM_CREATOR_EVENT_TEXT_FIELD.GAME_NAME)
    .setLabel("Game name")
    .setStyle("SHORT")
    .setPlaceholder("Game name")
    .setRequired(true);

  const eventDateTimeInput = new TextInputComponent()
    .setCustomId(TEAM_CREATOR_EVENT_TEXT_FIELD.DATE)
    .setLabel("Date (format: DD/MM/YYYY hour:minute)")
    .setStyle("SHORT")
    .setPlaceholder("Event date and time")
    .setRequired(true);

  const eventTimezoneInput = new TextInputComponent()
    .setCustomId(TEAM_CREATOR_EVENT_TEXT_FIELD.TIMEZONE)
    .setLabel("Your timezone: timezones.etourne.com")
    .setStyle("SHORT")
    .setPlaceholder("Your timezone")
    .setRequired(true);

  const eventDescriptionInput = new TextInputComponent()
    .setCustomId(TEAM_CREATOR_EVENT_TEXT_FIELD.EVENT_DESCRIPTION)
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
