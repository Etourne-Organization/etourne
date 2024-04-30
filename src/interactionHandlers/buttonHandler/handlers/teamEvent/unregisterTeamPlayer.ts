import { ButtonInteraction, Client, MessageEmbed } from "discord.js";

import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import BOT_CONFIGS from "botConfig";
import { removePlayer } from "supabaseDB/methods/teamPlayers";
import { checkTeamExists } from "supabaseDB/methods/teams";
import { ButtonFunction } from "../../type";

const unregisterTeamPlayer: ButtonFunction = {
  customId: "unregisterTeamPlayer",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      const embed = interaction.message.embeds[0];
      const splitFooter = embed.footer?.text.split(" ") || [];
      const teamId = splitFooter[2] || "";

      if (!(await checkTeamExists({ teamId: parseInt(teamId) }))) {
        return interactionHandler
          .embeds(
            new CustomMessageEmbed().setTitle(
              "The team does not exist anymore, maybe it was deleted?",
            ).Error,
          )
          .followUp();
      }

      const registeredPlayersField = embed.fields?.find((field) =>
        field.name.includes("Registered players"),
      );

      if (registeredPlayersField?.value.length === 0) {
        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("The registration list is empty!").Error)
          .followUp();
      }

      const registeredPlayers =
        registeredPlayersField?.value.split(">>> ")[1]?.split("\n").filter(Boolean) || [];
      const registeredIndex = registeredPlayers.indexOf(interaction.user.username);

      // ? Check if the current user is not registered
      if (registeredIndex === -1) {
        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("You are not registered!").Error)
          .followUp();
      }

      // ? If the user is registered, remove them from the list
      registeredPlayers.splice(registeredIndex, 1);
      const newPlayersList = registeredPlayers.join("\n");

      // ? Prepare updated player list to go back to the orignal embed field
      const numRegisteredPlayers = registeredPlayers.length;
      const maxNumPlayersEmbedValue =
        registeredPlayersField?.name.split(" ")[2].split("/")[1] || "";

      const updatedField = {
        name: `Registered players ${numRegisteredPlayers}/${maxNumPlayersEmbedValue}`,
        value: `>>> ${newPlayersList}`,
      };

      // ? update embed field
      const fields =
        embed.fields?.map((field) =>
          field.name.includes("Registered players") ? updatedField : field,
        ) || [];

      await removePlayer({
        discordUserId: interaction.user.id,
        teamId: parseInt(teamId),
      });

      const editedEmbed = new MessageEmbed()
        .setColor(BOT_CONFIGS.color.default)
        .setTitle(embed.title || "Undefined")
        .setDescription(embed.description || "Undefined")
        .addFields(fields)
        .setFooter({ text: `${embed.footer?.text}` });

      await interactionHandler.embeds(editedEmbed).editReply();

      return interactionHandler
        .embeds(new CustomMessageEmbed().setTitle("Unregistered successfully!").Success)
        .followUp();
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().defaultErrorDescription().Error)
          .followUp(),
      );
    }
  },
};

export default unregisterTeamPlayer;
