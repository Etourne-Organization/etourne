import { ButtonInteraction, Client } from "discord.js";

import { findFooterEventId } from "src/interactionHandlers/utils";
import { getTeamEventCountDB } from "supabaseDB/methods/players";
import { getEventColumnDB } from "supabaseDB/methods/columns";
import getMessageEmbed from "utils/interactions/getInteractionEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../../type";
import { createMaxTeamLimitEmbed } from "../../../utils/embeds";
import { createTeamComponents } from "../../../utils/modalComponents";
import { TEAM_CREATOR_EVENT_TEXT_FIELD } from "../../../utils/constants";

const createTeam: ButtonFunction = {
  customId: TEAM_CREATOR_EVENT_TEXT_FIELD.CREATE_TEAM,
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const eventId = findFooterEventId(embed.footer);

      const maxNumTeams = (await getEventColumnDB(eventId, "maxNumTeams")) || 0;

      const currentMaxTeams = (await getTeamEventCountDB(eventId)) || 0;

      if (currentMaxTeams >= maxNumTeams) {
        const maxTeamLimitEmbed = createMaxTeamLimitEmbed();
        return interactionHandler.embeds(maxTeamLimitEmbed).reply();
      }

      const modal = createTeamComponents(interaction.id);

      await interaction.showModal(modal);
    } catch (err) {
      await handleAsyncError(err, () =>
        interactionHandler
          .embeds(
            new CustomMessageEmbed().defaultErrorTitle().SHORT.defaultErrorDescription().SHORT
              .Error,
          )
          .reply(),
      );
    }
  },
};

export default createTeam;
