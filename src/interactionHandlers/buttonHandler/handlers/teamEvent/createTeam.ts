import { ButtonInteraction, Client } from "discord.js";

import { findFooterEventId } from "src/interactionHandlers/utils";
import { getColumnValueById } from "supabaseDB/methods/events";
import { getNumOfTeams } from "supabaseDB/methods/teams";
import getMessageEmbed from "utils/getMessageEmbed";
import InteractionHandler from "utils/interactions/interactionHandler";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import { handleAsyncError } from "utils/logging/handleAsyncError";
import { ButtonFunction } from "../../type";
import { createTeamComponents } from "../../utils/modalComponents";

const createTeam: ButtonFunction = {
  customId: "createTeam",
  run: async (client: Client, interaction: ButtonInteraction) => {
    const interactionHandler = new InteractionHandler(interaction);
    try {
      const embed = getMessageEmbed(interaction, interactionHandler);
      if (!embed) return;
      const eventId = findFooterEventId(embed.footer);

      const maxNumTeams = await getColumnValueById({
        id: parseInt(eventId),
        columnName: "maxNumTeams",
      });

      if (
        maxNumTeams.length > 0 &&
        (await getNumOfTeams({ eventId: parseInt(eventId) })) === maxNumTeams[0]?.maxNumTeams
      ) {
        return interactionHandler
          .embeds(
            new CustomMessageEmbed().setTitle("Number of teams has reached the limit!").Warning,
          )
          .reply();
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
