import { Message } from "discord.js";
import COMMAND_IDS from "src/constants/commandIds";
import CustomMessageEmbed from "utils/interactions/customMessageEmbed";

export function createSupportEmbed() {
  return new CustomMessageEmbed()
    .setTitle(":tools: Support")
    .setDescription("Join the support server: https://discord.gg/vNe9QVrWNa")
    .setTimestamp().Info;
}

export function createServerNotRegisteredEmbed() {
  return new CustomMessageEmbed()
    .setTitle("Error: Server not registered!")
    .setDescription(
      `Use </registerserver:${COMMAND_IDS.REGISTER_SERVER}> command to register your server in Etourne database.`,
    )
    .setFooter({ text: "Use /support to seek support if required." })
    .setTimestamp().Error;
}

export function createServerAlreadyRegisteredEmbed() {
  return new CustomMessageEmbed().setTitle("Your server is already registered!").Warning;
}

export function createRequiredBotPermissionsEmbed() {
  return new CustomMessageEmbed()
    .setTitle("Error")
    .setDescription(
      "Please give the following permission to the bot: \n - `View Audit Log` \n \n## Why is this needed? \n This permission will allow the bot to retrieve the user who added the bot and make that user `Admin` (**NOT** server `Admin`) in Etourne software.",
    )
    .setTimestamp().Error;
}

export function createCannotRunCommandEmbed() {
  return new CustomMessageEmbed().setTitle("You are not allowed to run this command!").Error;
}

export function createUserAlreadyRegisteredEmbed() {
  return new CustomMessageEmbed().setTitle("You are already registered in Etourne database!")
    .Warning;
}

export function createNonAdminEmbed() {
  return new CustomMessageEmbed().setTitle(
    "You are not the user who added the bot into this server!",
  ).Error;
}

export function createNonSharableEventEmbed(
  fetchedMessage: Message<boolean>,
  guildId: string | null,
) {
  return new CustomMessageEmbed()
    .setTitle("Event cannot be shared!")
    .setDescription(
      `The event embed has already been shared in <#${fetchedMessage.channelId}> (message link: https://discord.com/channels/${guildId}/${fetchedMessage.channelId}/${fetchedMessage.id})\nTo reshare the event embed in a new channel, delete the existing event embed.`,
    )
    .setTimestamp().Error;
}
