import { MessageActionRow, MessageSelectMenu } from "discord.js";
import { NORMAL_CREATOR_EVENT_TEXT_FIELD } from "src/interactionHandlers/buttonHandler/utils/constants";

export function createNormalCreatorSelectComponents() {
  const selectMenuOptions: Array<{
    label: string;
    description: string;
    value: string;
  }> = [
    {
      label: "Create normal event",
      description: "Create normal event with no team feature",
      value: "createEvent",
    },
    {
      label: "Create team event",
      description: "Create team event with team creation feature",
      value: "createTeamEvent",
    },
  ];

  const selectMenu = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId(NORMAL_CREATOR_EVENT_TEXT_FIELD.SELECT_EVENT_TYPE)
      .setPlaceholder("Select event type you would like to create")
      .addOptions(selectMenuOptions),
  );

  return selectMenu;
}
