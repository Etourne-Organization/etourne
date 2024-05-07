import { ButtonInteraction, Client } from "discord.js";
import { findFooterEventId } from "src/interactionHandlers/utils";
import { getEventColumnDB } from "supabaseDB/methods/columns";
import getMessageEmbed from "utils/interactions/getInteractionEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../../type";
import { createSetMaxNumTeamsComponents } from "../../../utils/modalComponents";
import { TEAM_CREATOR_EVENT_TEXT_FIELD } from "../../../utils/constants";

const setMaxNumTeams: ButtonFunction = {
  customId: TEAM_CREATOR_EVENT_TEXT_FIELD.SET_MAX_NUM_TEAMS,
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);

    try {
      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;

      const eventId = findFooterEventId(embed.footer);

      const maxNumTeams = await getEventColumnDB(eventId, "maxNumTeams");

      const modal = createSetMaxNumTeamsComponents(interaction.id, maxNumTeams?.toString());

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

export default setMaxNumTeams;
