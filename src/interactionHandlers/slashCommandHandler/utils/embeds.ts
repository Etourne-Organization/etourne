import BOT_CONFIGS from "botConfig";
import { MessageEmbed } from "discord.js";
import COMMAND_IDS from "utils/commandIds";
import CustomMessageEmbed from "utils/interactions/messageEmbed";

export function createSupportEmbed() {
  return new MessageEmbed()
    .setColor(BOT_CONFIGS.color.default)
    .setTitle(":tools: Support")
    .setDescription("Join the support server: https://discord.gg/vNe9QVrWNa")
    .setTimestamp();
}

export function createServerNotRegisteredEmbed() {
  return new MessageEmbed()
    .setColor(BOT_CONFIGS.color.red)
    .setTitle(":x: Error: Server not registered!")
    .setDescription(
      `Use </registerserver:${COMMAND_IDS.REGISTER_SERVER}> command to register your server in Etourne database.`,
    )
    .setFooter({ text: "Use /support to seek support if required." })
    .setTimestamp();
}

export function createRequiredBotPermissionsEmbed() {
  return new MessageEmbed()
    .setColor(BOT_CONFIGS.color.red)
    .setTitle(":x: Error")
    .setDescription(
      "Please give the following permission to the bot: \n - `View Audit Log` \n \n## Why is this needed? \n This permission will allow the bot to retrieve the user who added the bot and make that user `Admin` (**NOT** server `Admin`) in Etourne software.",
    )
    .setTimestamp();
}

export function createCannotRunCommandEmbed() {
  return new CustomMessageEmbed().setTitle("You are not allowed to run this command!").Error;
}

export function createUserAlreadyRegisteredEmbed() {
  return new CustomMessageEmbed().setTitle("You are already registered in Etourne database!")
    .Warning;
}

export function createServerAlreadyRegisteredEmbed() {
  return new CustomMessageEmbed().setTitle("Your server is already registered!").Warning;
}

export function createNonAdminEmbed() {
  return new CustomMessageEmbed().setTitle(
    "You are not the user who added the bot into this server!",
  ).Error;
}
