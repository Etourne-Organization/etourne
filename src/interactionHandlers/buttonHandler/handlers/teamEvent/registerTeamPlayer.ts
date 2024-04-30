import { ButtonInteraction, Client, MessageEmbed } from "discord.js";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import BOT_CONFIGS from "botConfig";
import { getColumnValueById } from "supabaseDB/methods/events";
import { addPlayer, getNumOfTeamPlayers } from "supabaseDB/methods/teamPlayers";
import { checkTeamExists } from "supabaseDB/methods/teams";
import { ButtonFunction } from "../../type";

const registerTeamPlayer: ButtonFunction = {
  customId: "registerTeamPlayer",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      await interaction.deferUpdate();

      const embed = interaction.message.embeds[0];
      const splitFooter = embed.footer?.text.split(" ") || [];
      const teamId = splitFooter[2] || "";
      const eventId = splitFooter[5] || "";

      const maxNumTeamPlayersData = await getColumnValueById({
        id: parseInt(eventId),
        columnName: "maxNumTeamPlayers",
      });

      const maxNumTeamPlayers = maxNumTeamPlayersData[0]?.maxNumTeamPlayers || 0;

      if (!(await checkTeamExists({ teamId: parseInt(teamId) }))) {
        return interactionHandler
          .embeds(
            new CustomMessageEmbed().setTitle(
              "The team does not exist anymore, maybe it was deleted?",
            ).Error,
          )
          .followUp();
      }

      const currentNumPlayers = await getNumOfTeamPlayers({ teamId: parseInt(teamId) });
      if (currentNumPlayers >= maxNumTeamPlayers) {
        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("Number of players has reached the limit!").Error)
          .followUp();
      }

      const registeredPlayersField = embed.fields?.find((field) =>
        field.name.includes("Registered players"),
      );

      const registeredPlayers =
        registeredPlayersField?.value.split(">>> ")[1]?.split("\n").filter(Boolean) || [];

      // ? Check if the current user is already registered
      if (registeredPlayers.includes(interaction.user.username)) {
        return interactionHandler
          .embeds(new CustomMessageEmbed().setTitle("You are already registered!").Error)
          .followUp();
      }

      // ? If the user is not registered, add them to the existing list
      const newPlayersList = [...registeredPlayers, interaction.user.username].join("\n");

      // ? Prepare updated player list to go back to the orignal embed field
      const numRegisteredPlayers = registeredPlayers.length + 1;
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

      await addPlayer({
        username: interaction.user.username,
        discordUserId: interaction.user.id,
        teamId: parseInt(teamId),
        discordServerId: interaction.guild!.id,
      });

      const editedEmbed = new MessageEmbed()
        .setColor(BOT_CONFIGS.color.default)
        .setTitle(embed.title || "Undefined")
        .setDescription(embed.description || "Undefined")
        .addFields(fields)
        .setFooter({ text: `${embed.footer?.text}` });

      await interactionHandler.embeds(editedEmbed).editReply();

      return interactionHandler
        .embeds(editedEmbed, new CustomMessageEmbed().setTitle("Registered successfully!").Success)
        .followUp();
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(
            new CustomMessageEmbed().defaultErrorTitle().SHORT.defaultErrorDescription().SHORT.Error,
          )
          .followUp(),
      );
    }
  },
};

export default registerTeamPlayer;
