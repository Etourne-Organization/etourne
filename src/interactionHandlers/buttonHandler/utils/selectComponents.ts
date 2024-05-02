import BOT_CONFIGS from "botConfig";
import { MessageActionRow, MessageSelectMenu, MessageEmbed } from "discord.js";

export function createNormalRemovePlayerComponents(
  players: { username: string; userId: string }[],
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
      label: player?.username || "",
      description: `Remove ${player?.username}`,
      value: `${player?.username}||${player?.userId}`,
    });
    // }
  }

  const selectMenu = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId("removePlayer")
      .setPlaceholder("Select a player to be removed")
      .addOptions(selectMenuOptions),
  );

  const selectMessageEmbed = new MessageEmbed()
    .setTitle("Select player to be removed")
    .setColor(BOT_CONFIGS.color.default)
    .setFooter({ text: footerText })
    .setTimestamp();

  return { selectMenu, selectMessageEmbed };
}

export function createTeamRemovePlayerComponents(
  teamPlayers: { username: string; userId: string }[],
  footerText: string = "",
) {
  const selectMenuOptions: {
    label: string;
    description: string;
    value: string;
  }[] = [];

  for (const player of teamPlayers) {
    // if (player?.username !== interaction.user.username) {
    selectMenuOptions.push({
      label: player?.username || "",
      description: `Remove ${player?.username}`,
      value: `${player?.username}||${player?.userId}`,
    });
    // }
  }

  const selectMenu = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId("removeTeamPlayer")
      .setPlaceholder("Select a player to be removed")
      .addOptions(selectMenuOptions),
  );

  const selectMessageEmbed = new MessageEmbed()
    .setTitle("Select team player to be removed")
    .setColor(BOT_CONFIGS.color.default)
    .setFooter({ text: footerText })
    .setTimestamp();

  return { selectMenu, selectMessageEmbed };
}