import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import {
  NORMAL_CREATOR_FIELD_NAMES,
  TEAM_CREATOR_FIELD_NAMES,
  TEAM_FIELD_NAMES,
} from "./constants";

type TeamCreatorEmbedType = {
  eventName: string;
  description: string;
  gameName: string;
  eventHost: string;
  eventId: number;
  eventDateTime: string;
  maxNumTeamPlayers?: string;
  maxNumTeams?: string;
};

export function createTeamCreatorEmbed({
  eventName,
  description,
  eventHost,
  eventId,
  gameName,
  eventDateTime,
  maxNumTeamPlayers,
  maxNumTeams,
}: TeamCreatorEmbedType) {
  return new CustomMessageEmbed()
    .setTitle(eventName)
    .setDescription(
      `**----------------------------------------** \n **${TEAM_CREATOR_FIELD_NAMES.description}:** \n \n ${description}  \n \n`,
    )
    .addFields([
      {
        name: TEAM_CREATOR_FIELD_NAMES.dateTime,
        inline: true,
        value: eventDateTime || "Unknown",
      },
      { name: TEAM_CREATOR_FIELD_NAMES.gameName, value: gameName, inline: true },
      {
        name: TEAM_CREATOR_FIELD_NAMES.maxNumOfTeams,
        value: maxNumTeams || "Unlimited",
      },
      {
        name: TEAM_CREATOR_FIELD_NAMES.maxNumOfTeamPlayers,
        value: maxNumTeamPlayers || "Unlimited",
      },
      { name: TEAM_CREATOR_FIELD_NAMES.hostedBy, value: `${eventHost}` },
    ])
    .setFooter({
      text: `${TEAM_CREATOR_FIELD_NAMES.eventId}: ${eventId}`,
    }).Info;
}

export type TeamEmbedType = {
  teamId: string | number;
  eventId: string | number;
  teamName: string;
  description: string;
  teamLeader: string;
  eventName?: string;
  eventDateTime?: string;
  teamPlayers?: {
    registered?: string;
    max?: string;
  };
  replaceRegisteredPlayers?: {
    name?: string;
    value?: string;
  };
};

export function createTeamEmbed({
  teamId,
  eventId,
  teamName,
  description,
  eventName,
  teamLeader,
  eventDateTime,
  teamPlayers,
  replaceRegisteredPlayers,
}: TeamEmbedType) {
  return new CustomMessageEmbed()
    .setTitle(teamName)
    .setDescription(`${description}`)
    .addFields([
      {
        name: TEAM_FIELD_NAMES.teamLeader,
        value: teamLeader,
      },
      {
        name: TEAM_FIELD_NAMES.eventName,
        value: eventName || "Unknown",
      },
      {
        name: TEAM_FIELD_NAMES.dateTime,
        value: eventDateTime || "Unknown",
      },
      {
        name:
          (replaceRegisteredPlayers &&
            replaceRegisteredPlayers.name &&
            replaceRegisteredPlayers.name.length > 0 &&
            replaceRegisteredPlayers.name) ||
          `${TEAM_FIELD_NAMES.registeredPlayers} ${(teamPlayers && teamPlayers.registered) || "0"}/${(teamPlayers && teamPlayers.max) || "Unlimited"}`,
        value:
          (replaceRegisteredPlayers &&
            replaceRegisteredPlayers.value &&
            replaceRegisteredPlayers?.value.length > 0 &&
            replaceRegisteredPlayers.value) ||
          " ",
      },
    ])
    .setFooter({
      text: `${TEAM_FIELD_NAMES.teamId}: ${teamId} ${TEAM_FIELD_NAMES.eventId}: ${eventId}`,
    }).Info;
}

type NormalCreatorEmbedType = {
  eventName: string;
  description: string;
  gameName: string;
  eventHost: string;
  eventId: string | number;
  eventDateTime: string;
  teamPlayers?: {
    registered?: string;
    max?: string;
  };
  replaceRegisteredPlayers?: {
    name?: string;
    value?: string;
  };
};

export function createNormalCreatorEmbed({
  eventName,
  description,
  eventHost,
  eventId,
  gameName,
  eventDateTime,
  replaceRegisteredPlayers,
  teamPlayers,
}: NormalCreatorEmbedType) {
  return new CustomMessageEmbed()
    .setTitle(eventName)
    .setDescription(
      `**----------------------------------------** \n **${NORMAL_CREATOR_FIELD_NAMES.description}:** \n \n ${description}  \n \n`,
    )
    .addFields([
      {
        name: NORMAL_CREATOR_FIELD_NAMES.dateTime,
        inline: true,
        value: eventDateTime || "Unknown",
      },
      { name: NORMAL_CREATOR_FIELD_NAMES.gameName, value: gameName, inline: true },
      { name: NORMAL_CREATOR_FIELD_NAMES.hostedBy, value: `${eventHost}` },
      {
        name:
          (replaceRegisteredPlayers &&
            replaceRegisteredPlayers.name &&
            replaceRegisteredPlayers.name.length > 0 &&
            replaceRegisteredPlayers.name) ||
          `${NORMAL_CREATOR_FIELD_NAMES.registeredPlayers} ${(teamPlayers && teamPlayers.registered) || "0"}/${(teamPlayers && teamPlayers.max) || "Unlimited"}`,
        value:
          (replaceRegisteredPlayers &&
            replaceRegisteredPlayers.value &&
            replaceRegisteredPlayers?.value.length > 0 &&
            replaceRegisteredPlayers.value) ||
          " ",
      },
    ])
    .setFooter({
      text: `${NORMAL_CREATOR_FIELD_NAMES.eventId}: ${eventId}`,
    }).Info;
}
