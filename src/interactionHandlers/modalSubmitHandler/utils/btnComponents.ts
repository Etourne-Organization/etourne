import { MessageActionRow, MessageButton } from "discord.js";
import {
  NORMAL_CREATOR_EVENT_TEXT_FIELD,
  TEAM_CREATOR_EVENT_TEXT_FIELD,
  TEAM_EVENT_TEXT_FIELD,
} from "src/interactionHandlers/buttonHandler/utils/constants";

export function createTeamCreatorButtonComponents() {
  const buttons = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(TEAM_CREATOR_EVENT_TEXT_FIELD.CREATE_TEAM)
      .setLabel("Create Team")
      .setStyle("PRIMARY"),
  );

  const setMaxNumButtons = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(TEAM_CREATOR_EVENT_TEXT_FIELD.SET_MAX_NUM_TEAMS)
      .setLabel("Set max num of teams")
      .setStyle("SECONDARY"),
    new MessageButton()
      .setCustomId(TEAM_CREATOR_EVENT_TEXT_FIELD.SET_MAX_NUM_TEAM_PLAYERS)
      .setLabel("Set max num of team players")
      .setStyle("SECONDARY"),
  );

  const manageEventButtons = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(TEAM_CREATOR_EVENT_TEXT_FIELD.EDIT_TEAM_EVENT_INFO)
      .setLabel("⚙️  Edit event info")
      .setStyle("SECONDARY"),
    new MessageButton()
      .setCustomId(TEAM_CREATOR_EVENT_TEXT_FIELD.DELETE_EVENT)
      .setLabel("🗑️  Delete event")
      .setStyle("DANGER"),
  );

  return [buttons, setMaxNumButtons, manageEventButtons];
}
export function createTeamButtonComponents() {
  const buttons = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(TEAM_EVENT_TEXT_FIELD.REGISTER_TEAM_PLAYER)
      .setLabel("Register yourself")
      .setStyle("PRIMARY"),
    new MessageButton()
      .setCustomId(TEAM_EVENT_TEXT_FIELD.UNREGISTER_TEAM_PLAYER)
      .setLabel("Unregister yourself")
      .setStyle("DANGER"),
  );

  const manageTeamPlayersButtons = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(TEAM_EVENT_TEXT_FIELD.REMOVE_TEAM_PLAYER)
      .setLabel("❌  Remove team player")
      .setStyle("SECONDARY"),
  );

  const manageTeamButtons = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(TEAM_EVENT_TEXT_FIELD.EDIT_TEAM_INFO)
      .setLabel("⚙️  Edit team info")
      .setStyle("SECONDARY"),
    new MessageButton()
      .setCustomId(TEAM_EVENT_TEXT_FIELD.DELETE_TEAM)
      .setLabel("🗑️  Delete team")
      .setStyle("DANGER"),
  );

  return [buttons, manageTeamPlayersButtons, manageTeamButtons];
}

export function createNormalCreatorButtonComponents() {
  const buttons = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(NORMAL_CREATOR_EVENT_TEXT_FIELD.REGISTER_PLAYER)
      .setLabel("Register yourself")
      .setStyle("PRIMARY"),
    new MessageButton()
      .setCustomId(NORMAL_CREATOR_EVENT_TEXT_FIELD.UNREGISTER_PLAYER)
      .setLabel("Unregister yourself")
      .setStyle("DANGER"),
  );

  const managePlayerButtons = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(NORMAL_CREATOR_EVENT_TEXT_FIELD.SET_MAX_NUM_PLAYERS)
      .setLabel("Set max num of players")
      .setStyle("SECONDARY"),
    new MessageButton()
      .setCustomId(NORMAL_CREATOR_EVENT_TEXT_FIELD.REMOVE_PLAYER)
      .setLabel("❌  Remove player")
      .setStyle("SECONDARY"),
  );

  const manageEventButtons = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId(NORMAL_CREATOR_EVENT_TEXT_FIELD.EDIT_EVENT_INFO)
      .setLabel("⚙️  Edit event info")
      .setStyle("SECONDARY"),
    new MessageButton()
      .setCustomId(NORMAL_CREATOR_EVENT_TEXT_FIELD.DELETE_EVENT)
      .setLabel("🗑️  Delete event")
      .setStyle("DANGER"),
  );

  return [buttons, managePlayerButtons, manageEventButtons];
}
