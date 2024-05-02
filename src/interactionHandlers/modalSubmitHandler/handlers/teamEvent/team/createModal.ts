import { Client, ModalSubmitInteraction } from "discord.js";

import { findFooterEventId } from "src/interactionHandlers/utils";
import { addTeam, setColumnValue } from "supabaseDB/methods/teams";
import getMessageEmbed from "utils/getMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ModalSubmit } from "../../../type";
import { createTeamButtonComponents } from "../../../utils/btnComponents";
import { TEAM_CREATOR_FIELD_NAMES } from "../../../utils/constants";
import { createTeamEmbed } from "../../../utils/embeds";
import { findEmbedField } from "../../../utils/utils";

const teamModal: ModalSubmit = {
  customId: "teamModalSubmit",
  run: async (client: Client, interaction: ModalSubmitInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      await interactionHandler.processing("Creating Team...");

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const eventName = embed?.title || "";
      const eventId = findFooterEventId(embed?.footer);
      const maxNumTeamPlayers = findEmbedField(
        embed?.fields,
        TEAM_CREATOR_FIELD_NAMES.maxNumOfTeamPlayers,
      );
      const eventDateTime = findEmbedField(embed?.fields, TEAM_CREATOR_FIELD_NAMES.dateTime);

      const newTeamName: string = interaction.fields.getTextInputValue("teamName");
      const newTeamDescription: string =
        interaction.fields.getTextInputValue("teamShortDescription");

      const teamId = await addTeam({
        eventId: parseInt(eventId),
        teamName: newTeamName,
        teamDescription: newTeamDescription,
        teamLeaderDiscordUserId: interaction.user.id,
        teamLeaderUsername: interaction.user.username,
        discordServerId: interaction.guild!.id,
      });

      const messageComponents = createTeamButtonComponents();

      const teamEmbed = createTeamEmbed({
        eventId,
        teamId,
        description: newTeamDescription,
        eventDateTime,
        teamName: newTeamName,
        eventName,
        teamLeader: interaction.user.username,
        teamPlayers: {
          max: maxNumTeamPlayers,
        },
      });

      const reply = await interaction.channel?.send({
        embeds: [teamEmbed],
        components: messageComponents,
      });

      await setColumnValue({
        data: [
          {
            id: teamId,
            key: "messageId",
            value: reply!.id,
          },
        ],
      });

      await interactionHandler
        .embeds(new CustomMessageEmbed().setTitle("Team created successfully!").Success)
        .editReply();
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().defaultErrorDescription().Error)
          .editReply(),
      );
    }
  },
};

export default teamModal;
