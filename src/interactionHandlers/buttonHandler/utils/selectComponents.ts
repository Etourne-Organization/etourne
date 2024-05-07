import { MessageActionRow, MessageSelectMenu } from "discord.js";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import { NORMAL_CREATOR_EVENT_TEXT_FIELD, TEAM_EVENT_TEXT_FIELD } from "./constants";

export function createNormalRemovePlayerComponents(
  players: { userId: number; Users: { username: string } }[],
  footerText: string = "",
) {
  const selectMenuOptions: {
    label: string;
    description: string;
    value: string;
  }[] = [];

  for (const player of players) {
    // if (player?.username !== interaction.user.username) {
    selectMenuOptions.push({
      label: player?.Users.username || "",
      description: `Remove ${player?.Users.username}`,
      value: `${player?.Users.username}||${player?.userId}`,
    });
    // }
  }

  const selectMenu = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId(NORMAL_CREATOR_EVENT_TEXT_FIELD.REMOVE_PLAYER)
      .setPlaceholder("Select a player to be removed")
      .addOptions(selectMenuOptions),
  );

  const selectMessageEmbed = new CustomMessageEmbed()
    .setTitle("Select player to be removed")
    .setFooter({ text: footerText })
    .setTimestamp().Info;

  return { selectMenu, selectMessageEmbed };
}

export function createTeamRemovePlayerComponents(
  teamPlayers: { userId: number; Users: { username: string } }[],
  footerText: string = "",
) {
  const selectMenuOptions: {
    label: string;
    description: string;
    value: string;
  }[] = [];

  for (const player of teamPlayers) {
    const username = player.Users.username || "";

    // if (player?.username !== interaction.user.username) {
    selectMenuOptions.push({
      label: username,
      description: `Remove ${username}`,
      value: `${username}||${player?.userId}`,
    });
    // }
  }

  const selectMenu = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId(TEAM_EVENT_TEXT_FIELD.REMOVE_TEAM_PLAYER)
      .setPlaceholder("Select a player to be removed")
      .addOptions(selectMenuOptions),
  );

  const selectMessageEmbed = new CustomMessageEmbed()
    .setTitle("Select team player to be removed")
    .setFooter({ text: footerText })
    .setTimestamp().Info;

  return { selectMenu, selectMessageEmbed };
}
