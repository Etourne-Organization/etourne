import {
  ButtonInteraction,
  Client,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
} from "discord.js";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import BOT_CONFIGS from "botConfig";
import { getAllTeamPlayers } from "supabaseDB/methods/teamPlayers";
import { checkTeamExists } from "supabaseDB/methods/teams";
import { getUserRole } from "supabaseDB/methods/users";
import { ButtonFunction } from "../../type";

const removeTeamPlayer: ButtonFunction = {
  customId: "removeTeamPlayer",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interactionHandler.processing();

      const footer = interaction.message.embeds[0].footer?.text;
      const teamId: string = interaction.message.embeds[0].footer?.text.split(" ")[2] || "";

      if (!(await checkTeamExists({ teamId: parseInt(teamId) }))) {
        return interactionHandler
          .embeds(
            new CustomMessageEmbed().setTitle(
              "The team does not exist anymore, maybe it was deleted?",
            ).Warning,
          )
          .editReply();
      }

      const teamLeader = interaction.message?.embeds[0].fields?.find(
        (r) => r.name === "Team Leader",
      );

      // check user role in DB
      const userRoleDB = await getUserRole({
        discordUserId: interaction.user.id,
        discordServerId: interaction.guild!.id,
      });

      // Check if the user is the team leader or has an authorized role (e.g., admin or mod)
      const isAuthorized =
        interaction.user.username === teamLeader?.value ||
        (userRoleDB.length > 0 && (userRoleDB[0]["roleId"] === 2 || userRoleDB[0]["roleId"] === 3));

      if (!isAuthorized) {
        // If the user isn't authorized, return an error message
        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("You are not allowed to use this button!").Error)
          .editReply();
      }

      const teamPlayers = await getAllTeamPlayers({
        teamId: parseInt(teamId),
      });

      if (teamPlayers.length === 0)
        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("There are no team players to remove!").Error)
          .editReply();

      const selectMenuOptions: Array<{
        label: string;
        description: string;
        value: string;
      }> = [];

      for (const team of teamPlayers) {
        if (team?.username === interaction.user.username) return;

        selectMenuOptions.push({
          label: team?.username || "",
          description: `Remove ${team?.username}`,
          value: `${team?.username}||${team?.userId}`,
        });
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
        .setFooter({ text: `${footer}` })
        .setTimestamp();

      await interactionHandler.embeds(selectMessageEmbed).editReply({
        components: [selectMenu],
      });
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().defaultErrorDescription().Error)
          .editReply(),
      );
    }
  },
};

export default removeTeamPlayer;
