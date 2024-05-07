import { Client, ModalSubmitInteraction } from "discord.js";

import { createTeam } from "src/interactionHandlers/create";
import { findEmbedField, findFooterEventId } from "src/interactionHandlers/utils";
import { validateServerExists } from "src/interactionHandlers/validate";
import { updateTeamColumnsDB } from "supabaseDB/methods/columns";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import getMessageEmbed from "utils/interactions/getInteractionEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ModalSubmit } from "../../../type";
import { createTeamButtonComponents } from "../../../utils/btnComponents";
import { TEAM_CREATOR_FIELD_NAMES } from "../../../utils/constants";
import { createTeamEmbed } from "../../../utils/embeds";
import { TEAM_EVENT_TEXT_FIELD } from "src/interactionHandlers/buttonHandler/utils/constants";

const teamModal: ModalSubmit = {
  customId: TEAM_EVENT_TEXT_FIELD.TEAM_MODAL_SUBMIT,
  run: async (client: Client, interaction: ModalSubmitInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      await interactionHandler.processing("Creating Team...");

      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const eventName = embed.title || "";

      const eventId = findFooterEventId(embed?.footer);

      const maxNumTeamPlayers = findEmbedField(
        embed?.fields,
        TEAM_CREATOR_FIELD_NAMES.maxNumOfTeamPlayers,
      );

      const eventDateTime = findEmbedField(embed?.fields, TEAM_CREATOR_FIELD_NAMES.dateTime);

      const newTeamName = interaction.fields.getTextInputValue("teamName");
      const newTeamDescription = interaction.fields.getTextInputValue("teamShortDescription");

      const {
        isValid,
        embed: invalidEmbed,
        value: serverId,
      } = await validateServerExists(interaction.guildId);
      if (!isValid) return interactionHandler.embeds(invalidEmbed).editReply();

      const teamId = await createTeam({
        eventId,
        teamName: newTeamName,
        teamDescription: newTeamDescription,
        teamLeaderUserId: interaction.user.id,
        teamLeaderUsername: interaction.user.username,
        serverId,
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

      if (!reply)
        return interactionHandler
          .embeds(
            new CustomMessageEmbed().setDescription("Failed to get messageId").defaultErrorTitle()
              .SHORT.Error,
          )
          .editReply();

      await updateTeamColumnsDB(teamId, [{ key: "messageId", value: reply.id }]);

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
