import CustomMessageEmbed from "utils/interactions/customMessageEmbed";

export function createAlreadyRegisteredEmbed() {
  return new CustomMessageEmbed("You are already registered!").Error;
}

export function createNotRegisteredEmbed() {
  return new CustomMessageEmbed("You are not registered!").Error;
}

export function createEmptyRegistrationListEmbed() {
  return new CustomMessageEmbed("The registration list is empty!").Error;
}

export function createMaxPlayerLimitEmbed() {
  return new CustomMessageEmbed("Number of players has reached the limit!").Error;
}

export function createMaxTeamLimitEmbed() {
  return new CustomMessageEmbed("Number of teams has reached the limit!").Error;
}

export function createUnauthorizedRoleEmbed() {
  return new CustomMessageEmbed("You are not allowed to use this button!").Error;
}

export function createNoPlayersToRemoveEmbed() {
  return new CustomMessageEmbed("There are no players to remove!").Error;
}

export function createRemoveUserConfirmationEmbed(username: string) {
  return new CustomMessageEmbed(`Are you sure you want to remove ${username}?`).Question;
}

export function createDeleteEventConfirmationEmbed() {
  return new CustomMessageEmbed(`Are you sure you want to delete this event?`).Question;
}

export function createDeleteTeamConfirmationEmbed() {
  return new CustomMessageEmbed(`Are you sure you want to delete this team?`).Question;
}

export function createMissingTeamEmbed() {
  return new CustomMessageEmbed("The team does not exist anymore, maybe it was deleted?").Error;
}
