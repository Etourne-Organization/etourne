import { MessageActionRow, Modal, ModalActionRowComponent, TextInputComponent } from "discord.js";

type EditNormalEventTypes = {
  interactionId: string;
  eventName: string;
  gameName: string;
  timezone: string;
  description: string;
};

type EditTeamEventTypes = {
  interactionId: string;
  name: string;
  description: string;
};

export function createEditNormalEventComponents({
  description,
  eventName,
  gameName,
  interactionId,
  timezone,
}: EditNormalEventTypes) {
  const modal = new Modal()
    .setCustomId(`editEventInfoModal-${interactionId}`)
    .setTitle("Edit event");

  const eventNameInput = new TextInputComponent()
    .setCustomId("eventName")
    .setLabel("Event name")
    .setStyle("SHORT")
    .setPlaceholder("Event name")
    .setValue(eventName);

  const gameNameInput = new TextInputComponent()
    .setCustomId("gameName")
    .setLabel("Game name")
    .setStyle("SHORT")
    .setPlaceholder("Game name")
    .setValue(gameName);

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
    .setValue(timezone);

  const eventDescriptionInput = new TextInputComponent()
    .setCustomId("eventDescription")
    .setLabel("Event description")
    .setStyle("PARAGRAPH")
    .setPlaceholder("Event description")
    .setValue(description);

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

export function createSetMaxNumUsersComponents({
  interactionId,
  currentMaxNum,
}: {
  interactionId: string;
  currentMaxNum?: string;
}) {
  const modal = new Modal()
    .setCustomId(`maxNumPlayersModalSubmit-${interactionId}`)
    .setTitle("Set max number of players");

  const input = new TextInputComponent()
    .setCustomId("maxNumPlayersInput")
    .setLabel("Num of players limit")
    .setStyle("SHORT")
    .setPlaceholder("Enter limit for num of players")
    .setValue(currentMaxNum || "");

  const teamMemberLimitNumActionRow = new MessageActionRow<ModalActionRowComponent>().addComponents(
    input,
  );

  modal.addComponents(teamMemberLimitNumActionRow);
  return modal;
}

export function createSetMaxNumTeamsComponents({
  interactionId,
  currentMaxNum,
}: {
  interactionId: string;
  currentMaxNum?: string;
}) {
  const modal = new Modal()
    .setCustomId(`setMaxNumTeamsModalSubmit-${interactionId}`)
    .setTitle("Set max number of teams");

  const maxNumTeamsInput = new TextInputComponent()
    .setCustomId("maxNumTeams")
    .setLabel("Max num of teams")
    .setStyle("SHORT")
    .setPlaceholder("Enter max num of teams")
    .setValue(currentMaxNum || "");

  const maxNumTeamsLimitActionRow = new MessageActionRow<ModalActionRowComponent>().addComponents(
    maxNumTeamsInput,
  );

  modal.addComponents(maxNumTeamsLimitActionRow);
  return modal;
}

export function createSetMaxNumTeamPlayersComponents({
  interactionId,
  currentMaxNum,
}: {
  interactionId: string;
  currentMaxNum?: string;
}) {
  const modal = new Modal()
    .setCustomId(`setMaxNumTeamPlayersModalSubmit-${interactionId}`)
    .setTitle("Set max number of team players");

  const maxNumTeamPlayersInput = new TextInputComponent()
    .setCustomId("maxNumTeamPlayers")
    .setLabel("Max num of team players")
    .setStyle("SHORT")
    .setPlaceholder("Enter max num of team players in each team")
    .setValue(currentMaxNum || "");

  const maxNumTeamPlayersActionRow = new MessageActionRow<ModalActionRowComponent>().addComponents(
    maxNumTeamPlayersInput,
  );

  modal.addComponents(maxNumTeamPlayersActionRow);
  return modal;
}

export function createEditTeamCreatorEventComponents({
  description,
  eventName,
  gameName,
  interactionId,
  timezone,
}: EditNormalEventTypes) {
  const modal = new Modal()
    .setCustomId(`editTeamEventInfoModal-${interactionId}`)
    .setTitle("Edit event");

  const eventNameInput = new TextInputComponent()
    .setCustomId("eventName")
    .setLabel("Event name")
    .setStyle("SHORT")
    .setPlaceholder("Event name")
    .setValue(eventName);

  const gameNameInput = new TextInputComponent()
    .setCustomId("gameName")
    .setLabel("Game name")
    .setStyle("SHORT")
    .setPlaceholder("Game name")
    .setValue(gameName);

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
    .setValue(timezone);

  const eventDescriptionInput = new TextInputComponent()
    .setCustomId("eventDescription")
    .setLabel("Event description")
    .setStyle("PARAGRAPH")
    .setPlaceholder("Event description")
    .setValue(description);

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

export function createEditTeamEventComponents({
  interactionId,
  name,
  description,
}: EditTeamEventTypes) {
  const teamFormModal = new Modal()
    .setCustomId(`editTeamInfoModal-${interactionId}`)
    .setTitle("Create Team");

  const teamNameInput = new TextInputComponent()
    .setCustomId("teamName")
    .setLabel("Team Name")
    .setStyle("SHORT")
    .setPlaceholder("Enter team name")
    .setValue(name);

  const teamSmallDescriptionInput = new TextInputComponent()
    .setCustomId("teamShortDescription")
    .setLabel("Team Short Description")
    .setStyle("SHORT")
    .setPlaceholder("Enter short team description")
    .setValue(description);

  const teamNameActionRow = new MessageActionRow<ModalActionRowComponent>().addComponents(
    teamNameInput,
  );

  const teamSmallDescriptionActionRow =
    new MessageActionRow<ModalActionRowComponent>().addComponents(teamSmallDescriptionInput);

  teamFormModal.addComponents(teamNameActionRow, teamSmallDescriptionActionRow);

  return teamFormModal;
}

export function createTeamComponents(interactionId: string) {
  const teamFormModal = new Modal()
    .setCustomId(`teamModalSubmit-${interactionId}`)
    .setTitle("Create Team");

  const teamNameInput = new TextInputComponent()
    .setCustomId("teamName")
    .setLabel("Team Name")
    .setStyle("SHORT")
    .setPlaceholder("Enter team name")
    .setRequired(true);

  const teamSmallDescriptionInput = new TextInputComponent()
    .setCustomId("teamShortDescription")
    .setLabel("Team Short Description")
    .setStyle("SHORT")
    .setPlaceholder("Enter short team description")
    .setRequired(true);

  const teamNameActionRow = new MessageActionRow<ModalActionRowComponent>().addComponents(
    teamNameInput,
  );

  const teamSmallDescriptionActionRow =
    new MessageActionRow<ModalActionRowComponent>().addComponents(teamSmallDescriptionInput);

  teamFormModal.addComponents(teamNameActionRow, teamSmallDescriptionActionRow);

  return teamFormModal;
}
