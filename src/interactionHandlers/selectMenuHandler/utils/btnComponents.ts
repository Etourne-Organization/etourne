import { ButtonInteraction, MessageActionRow, MessageButton } from "discord.js";

function getButtonIds(alias?: string) {
  const deleteYesId = `deleteYes${alias ? `-${alias}` : ""}`;
  const deleteNoId = `deleteNo${alias ? `-${alias}` : ""}`;
  return { deleteYesId, deleteNoId };
}

export function createConfirmationBtns(alias?: string) {
  const { deleteYesId, deleteNoId } = getButtonIds(alias);

  const component = new MessageActionRow().addComponents(
    new MessageButton().setCustomId(deleteYesId).setLabel("✔").setStyle("SUCCESS"),
    new MessageButton().setCustomId(deleteNoId).setLabel("✖").setStyle("DANGER"),
  );

  return { deleteYesId, deleteNoId, confirmationButtons: component };
}

export function collectorFilter(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  btnInteraction: ButtonInteraction | any,
  interactionUserId: string,
  alias?: string,
): boolean {
  const { deleteYesId, deleteNoId } = getButtonIds(alias);

  return (
    (btnInteraction.customId === deleteYesId || btnInteraction.customId === deleteNoId) &&
    btnInteraction.user.id === interactionUserId
  );
}
