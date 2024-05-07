import { MessageActionRow, Modal, ModalActionRowComponent, TextInputComponent } from "discord.js";
import {
  NORMAL_CREATOR_EVENT_TEXT_FIELD,
  TEAM_CREATOR_EVENT_TEXT_FIELD,
  TEAM_EVENT_TEXT_FIELD,
} from "./constants";

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
    .setCustomId(`${NORMAL_CREATOR_EVENT_TEXT_FIELD.EDIT_EVENT_INFO_MODAL}-${interactionId}`)
    .setTitle("Edit event");

  const eventNameInput = new TextInputComponent()
    .setCustomId(NORMAL_CREATOR_EVENT_TEXT_FIELD.EVENT_NAME)
    .setLabel("Event name")
    .setStyle("SHORT")
    .setPlaceholder("Event name")
    .setValue(eventName);

  const gameNameInput = new TextInputComponent()
    .setCustomId(NORMAL_CREATOR_EVENT_TEXT_FIELD.GAME_NAME)
    .setLabel("Game name")
    .setStyle("SHORT")
    .setPlaceholder("Game name")
    .setValue(gameName);

  const eventDateTimeInput = new TextInputComponent()
    .setCustomId(NORMAL_CREATOR_EVENT_TEXT_FIELD.DATE)
    .setLabel("Date (format: DD/MM/YYYY hour:minute)")
    .setStyle("SHORT")
    .setPlaceholder("Leave empty if changing not required");

  const eventTimezoneInput = new TextInputComponent()
    .setCustomId(NORMAL_CREATOR_EVENT_TEXT_FIELD.TIMEZONE)
    .setLabel("Your timezone: timezones.etourne.com")
    .setStyle("SHORT")
    .setPlaceholder("Your timezone")
    .setValue(timezone);

  const eventDescriptionInput = new TextInputComponent()
    .setCustomId(NORMAL_CREATOR_EVENT_TEXT_FIELD.EVENT_DESCRIPTION)
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

export function createSetMaxNumUsersComponents(interactionId: string, currentMaxNum?: string) {
  const modal = new Modal()
    .setCustomId(`${NORMAL_CREATOR_EVENT_TEXT_FIELD.MAX_NUM_PLAYERS_MODAL_SUBMIT}-${interactionId}`)
    .setTitle("Set max number of players");

  const input = new TextInputComponent()
    .setCustomId(NORMAL_CREATOR_EVENT_TEXT_FIELD.MAX_NUM_PLAYERS)
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

export function createSetMaxNumTeamsComponents(interactionId: string, currentMaxNum?: string) {
  const modal = new Modal()
    .setCustomId(`${TEAM_CREATOR_EVENT_TEXT_FIELD.SET_MAX_NUM_TEAMS_MODAL_SUBMIT}-${interactionId}`)
    .setTitle("Set max number of teams");

  const maxNumTeamsInput = new TextInputComponent()
    .setCustomId(TEAM_CREATOR_EVENT_TEXT_FIELD.MAX_NUM_TEAMS)
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

export function createSetMaxNumTeamPlayersComponents(
  interactionId: string,
  currentMaxNum?: string,
) {
  const modal = new Modal()
    .setCustomId(
      `${TEAM_CREATOR_EVENT_TEXT_FIELD.SET_MAX_NUM_TEAM_PLAYERS_MODAL_SUBMIT}-${interactionId}`,
    )
    .setTitle("Set max number of team players");

  const maxNumTeamPlayersInput = new TextInputComponent()
    .setCustomId(TEAM_CREATOR_EVENT_TEXT_FIELD.MAX_NUM_TEAM_PLAYERS)
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
    .setCustomId(`${TEAM_CREATOR_EVENT_TEXT_FIELD.EDIT_TEAM_EVENT_INFO_MODAL}-${interactionId}`)
    .setTitle("Edit event");

  const eventNameInput = new TextInputComponent()
    .setCustomId(TEAM_CREATOR_EVENT_TEXT_FIELD.EVENT_NAME)
    .setLabel("Event name")
    .setStyle("SHORT")
    .setPlaceholder("Event name")
    .setValue(eventName);

  const gameNameInput = new TextInputComponent()
    .setCustomId(TEAM_CREATOR_EVENT_TEXT_FIELD.GAME_NAME)
    .setLabel("Game name")
    .setStyle("SHORT")
    .setPlaceholder("Game name")
    .setValue(gameName);

  const eventDateTimeInput = new TextInputComponent()
    .setCustomId(TEAM_CREATOR_EVENT_TEXT_FIELD.DATE)
    .setLabel("Date (format: DD/MM/YYYY hour:minute)")
    .setStyle("SHORT")
    .setPlaceholder("Leave empty if changing not required");

  const eventTimezoneInput = new TextInputComponent()
    .setCustomId(TEAM_CREATOR_EVENT_TEXT_FIELD.TIMEZONE)
    .setLabel("Your timezone: timezones.etourne.com")
    .setStyle("SHORT")
    .setPlaceholder("Your timezone")
    .setValue(timezone);

  const eventDescriptionInput = new TextInputComponent()
    .setCustomId(TEAM_CREATOR_EVENT_TEXT_FIELD.EVENT_DESCRIPTION)
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
    .setCustomId(`${TEAM_EVENT_TEXT_FIELD.EDIT_TEAM_INFO_MODAL}-${interactionId}`)
    .setTitle("Create Team");

  const teamNameInput = new TextInputComponent()
    .setCustomId(TEAM_EVENT_TEXT_FIELD.TEAM_NAME)
    .setLabel("Team Name")
    .setStyle("SHORT")
    .setPlaceholder("Enter team name")
    .setValue(name);

  const teamSmallDescriptionInput = new TextInputComponent()
    .setCustomId(TEAM_EVENT_TEXT_FIELD.TEAM_SHORT_DESCRIPTION)
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
    .setCustomId(`${TEAM_EVENT_TEXT_FIELD.TEAM_MODAL_SUBMIT}-${interactionId}`)
    .setTitle("Create Team");

  const teamNameInput = new TextInputComponent()
    .setCustomId(TEAM_EVENT_TEXT_FIELD.TEAM_NAME)
    .setLabel("Team Name")
    .setStyle("SHORT")
    .setPlaceholder("Enter team name")
    .setRequired(true);

  const teamSmallDescriptionInput = new TextInputComponent()
    .setCustomId(TEAM_EVENT_TEXT_FIELD.TEAM_SHORT_DESCRIPTION)
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
