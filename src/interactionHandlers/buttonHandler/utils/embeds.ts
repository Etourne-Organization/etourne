import CustomMessageEmbed from "utils/interactions/messageEmbed";

export function createAlreadyRegisteredEmbed() {
  return new CustomMessageEmbed().setTitle("You are already registered!").Error;
}

export function createNotRegisteredEmbed() {
  return new CustomMessageEmbed().setTitle("You are not registered!").Error;
}

export function createEmptyRegistrationListEmbed() {
  return new CustomMessageEmbed().setTitle("The registration list is empty!").Error;
}

export function createMaxLimitEmbed() {
  return new CustomMessageEmbed().setTitle("Number of players has reached the limit!").Error;
}

export function createUnauthorizedRoleEmbed() {
  return new CustomMessageEmbed().setTitle("You are not allowed to use this button!").Error;
}

export function createNoPlayersToRemoveEmbed() {
  return new CustomMessageEmbed().setTitle("There are no players to remove!").Error;
}

export function createRemoveUserConfirmationEmbed(username: string) {
  return new CustomMessageEmbed().setTitle(`Are you sure you want to remove ${username}?`).Question;
}

export function createDeleteEventConfirmationEmbed() {
  return new CustomMessageEmbed().setTitle(`Are you sure you want to delete this event?`).Question;
}

export function createDeleteTeamConfirmationEmbed() {
  return new CustomMessageEmbed().setTitle(`Are you sure you want to delete this team?`).Question;
}

export function createMissingTeamEmbed() {
  return new CustomMessageEmbed().setTitle("The team does not exist anymore, maybe it was deleted?")
    .Error;
}
