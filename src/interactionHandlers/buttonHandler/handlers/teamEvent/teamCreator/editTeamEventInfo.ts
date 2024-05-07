import { ButtonInteraction, Client } from "discord.js";

import { findFooterEventId } from "src/interactionHandlers/utils";
import { validateServerExists, validateUserPermission } from "src/interactionHandlers/validate";
import { getEventColumnDB } from "supabaseDB/methods/columns";
import getMessageEmbed from "utils/interactions/getInteractionEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../../type";
import { createEditTeamCreatorEventComponents } from "../../../utils/modalComponents";
import { TEAM_CREATOR_EVENT_TEXT_FIELD } from "../../../utils/constants";

const editTeamEventInfo: ButtonFunction = {
  customId: TEAM_CREATOR_EVENT_TEXT_FIELD.EDIT_TEAM_EVENT_INFO,
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const {
        isValid: hasServer,
        embed: notRegisteredEmbed,
        value: serverId,
      } = await validateServerExists(interaction.guildId);
      if (!hasServer) return interactionHandler.embeds(notRegisteredEmbed).editReply();

      const { isValid: validPermission, embed: invalidEmbed } = await validateUserPermission(
        serverId,
        interaction.user.id,
      );
      if (!validPermission) return interactionHandler.embeds(invalidEmbed).editReply();

      const eventId = findFooterEventId(embed.footer);

      const eventObj = await getEventColumnDB(eventId, [
        "description",
        "eventName",
        "gameName",
        "timezone",
      ]);

      const modal = createEditTeamCreatorEventComponents({
        interactionId: interaction.id,
        description: eventObj.description!,
        eventName: eventObj.eventName!,
        gameName: eventObj.gameName!,
        timezone: eventObj.timezone!,
      });

      await interaction.showModal(modal);
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(new CustomMessageEmbed().defaultErrorTitle().defaultErrorDescription().Error)
          .reply(),
      );
    }
  },
};

export default editTeamEventInfo;
