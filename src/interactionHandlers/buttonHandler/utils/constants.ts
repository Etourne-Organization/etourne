export enum EVENT_TYPE_TEXT_FIELD {
  EVENT_NAME = "eventName",
  GAME_NAME = "gameName",
  DATETIME = "dateTime",
  TIMEZONE = "timezone",
  EVENT_DESCRIPTION = "eventDescription",
}

export enum NORMAL_CREATOR_EVENT_TEXT_FIELD {
  EDIT_EVENT_INFO = "editEventInfo",
  NORMAL_EVENT_MODAL_SUBMIT = "normalEventModalSubmit",
  EDIT_EVENT_INFO_MODAL = "editEventInfoModal",
  MAX_NUM_PLAYERS_MODAL_SUBMIT = "maxNumPlayersModalSubmit",
  EVENT_NAME = "eventName",
  GAME_NAME = "gameName",
  DATE = "date",
  TIMEZONE = "timezone",
  EVENT_DESCRIPTION = "eventDescription",
  MAX_NUM_PLAYERS = "maxNumPlayersInput",
  REMOVE_PLAYER = "removePlayer",
  REGISTER_PLAYER = "normalEventRegister",
  UNREGISTER_PLAYER = "normalEventUnregister",
  SET_MAX_NUM_PLAYERS = "setMaxNumPlayers",
  DELETE_EVENT = "deleteEvent",
  SELECT_EVENT_TYPE = "selectEventType",
}

export enum TEAM_CREATOR_EVENT_TEXT_FIELD {
  EDIT_TEAM_EVENT_INFO = "editTeamEventInfo",
  TEAM_EVENT_MODAL_SUBMIT = "teamEventModalSubmit",
  EDIT_TEAM_EVENT_INFO_MODAL = "editTeamEventInfoModal",
  SET_MAX_NUM_TEAMS_MODAL_SUBMIT = "setMaxNumTeamsModalSubmit",
  SET_MAX_NUM_TEAM_PLAYERS_MODAL_SUBMIT = "setMaxNumTeamPlayersModalSubmit",
  EVENT_NAME = "eventName",
  GAME_NAME = "gameName",
  DATE = "date",
  TIMEZONE = "timezone",
  EVENT_DESCRIPTION = "eventDescription",
  MAX_NUM_TEAMS = "maxNumTeams",
  MAX_NUM_TEAM_PLAYERS = "maxNumTeamPlayers",
  SET_MAX_NUM_TEAMS = "setMaxNumTeams",
  SET_MAX_NUM_TEAM_PLAYERS = "setMaxNumTeamPlayers",
  DELETE_EVENT = "deleteEvent",
  CREATE_TEAM = "createTeam",
}

export enum TEAM_EVENT_TEXT_FIELD {
  EDIT_TEAM_INFO = "editTeamInfo",
  EDIT_TEAM_INFO_MODAL = "editTeamInfoModal",
  TEAM_MODAL_SUBMIT = "teamModalSubmit",
  TEAM_NAME = "teamName",
  TEAM_SHORT_DESCRIPTION = "teamShortDescription",
  REGISTER_TEAM_PLAYER = "registerTeamPlayer",
  UNREGISTER_TEAM_PLAYER = "unregisterTeamPlayer",
  REMOVE_TEAM_PLAYER = "removeTeamPlayer",
  DELETE_TEAM = "deleteTeam",
}
