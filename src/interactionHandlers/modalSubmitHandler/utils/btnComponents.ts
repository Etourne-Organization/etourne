import { MessageActionRow, MessageButton } from "discord.js";

export function createTeamCreatorButtonComponents() {
  const buttons = new MessageActionRow().addComponents(
    new MessageButton().setCustomId("createTeam").setLabel("Create Team").setStyle("PRIMARY"),
  );

  const setMaxNumButtons = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("setMaxNumTeams")
      .setLabel("Set max num of teams")
      .setStyle("SECONDARY"),
    new MessageButton()
      .setCustomId("setMaxNumTeamPlayers")
      .setLabel("Set max num of team players")
      .setStyle("SECONDARY"),
  );

  const manageEventButtons = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("editTeamEventInfo")
      .setLabel("⚙️  Edit event info")
      .setStyle("SECONDARY"),
    new MessageButton().setCustomId("deleteEvent").setLabel("🗑️  Delete event").setStyle("DANGER"),
  );

  return [buttons, setMaxNumButtons, manageEventButtons];
}
export function createTeamButtonComponents() {
  const buttons = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("registerTeamPlayer")
      .setLabel("Register yourself")
      .setStyle("PRIMARY"),
    new MessageButton()
      .setCustomId("unregisterTeamPlayer")
      .setLabel("Unregister yourself")
      .setStyle("DANGER"),
  );

  const manageTeamPlayersButtons = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("removeTeamPlayer")
      .setLabel("❌  Remove team player")
      .setStyle("SECONDARY"),
  );

  const manageTeamButtons = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("editTeamInfo")
      .setLabel("⚙️  Edit team info")
      .setStyle("SECONDARY"),
    new MessageButton().setCustomId("deleteTeam").setLabel("🗑️  Delete team").setStyle("DANGER"),
  );

  return [buttons, manageTeamPlayersButtons, manageTeamButtons];
}

export function createNormalCreatorButtonComponents() {
  const buttons = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("normalEventRegister")
      .setLabel("Register yourself")
      .setStyle("PRIMARY"),
    new MessageButton()
      .setCustomId("normalEventUnregister")
      .setLabel("Unregister yourself")
      .setStyle("DANGER"),
  );

  const managePlayerButtons = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("setMaxNumPlayers")
      .setLabel("Set max num of players")
      .setStyle("SECONDARY"),
    new MessageButton()
      .setCustomId("removePlayer")
      .setLabel("❌  Remove player")
      .setStyle("SECONDARY"),
  );

  const manageEventButtons = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("editEventInfo")
      .setLabel("⚙️  Edit event info")
      .setStyle("SECONDARY"),
    new MessageButton().setCustomId("deleteEvent").setLabel("🗑️  Delete event").setStyle("DANGER"),
  );

  return [buttons, managePlayerButtons, manageEventButtons];
}
