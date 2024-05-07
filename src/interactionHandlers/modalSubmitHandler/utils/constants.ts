/**
 * Note: changing eventId or teamId values require a change in regex utils
 */

export enum TEAM_CREATOR_FIELD_NAMES {
  description = "Event description",
  dateTime = "Event date & time",
  gameName = "Game name",
  maxNumOfTeams = "Max num of teams",
  maxNumOfTeamPlayers = "Max num of team players",
  hostedBy = "Hosted by",
  eventId = "Event ID",
}

export enum TEAM_FIELD_NAMES {
  dateTime = "Event Date and Time",
  registeredPlayers = "Registered players",
  teamLeader = "Team Leader",
  eventName = "Event Name",
  eventId = "Event ID",
  teamId = "Team ID",
}

export enum NORMAL_CREATOR_FIELD_NAMES {
  description = "Event description",
  dateTime = "Event date & time",
  gameName = "Game name",
  hostedBy = "Hosted by",
  eventId = "Event ID",
  registeredPlayers = "Registered players",
}
