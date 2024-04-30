import { Client, Message } from "discord.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PREFIX: any = process.env.PREFIX;

import logError from "utils/logging/logError";
import { throwCompleteErrorLog } from "utils/logging/errorFormats";
import CustomMessageEmbed from "utils/interactions/messageEmbed";
import legacyCommands from "./commandsList";
import { legacyCommands as legacyCommandsInterface } from "./type";
/**
 * Registers event listeners for various types of interactions
 */
const legacyCommandHandler = (client: Client): void => {
  try {
    // Sets up an event listener for interaction events
    client.on("messageCreate", async (message: Message) => {
      if (!message.author.bot && message.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = message.content.trim().substring(PREFIX.length).split(/\s+/); //this is a regular expression which eliminates multiple whitespaces in the command

        if (CMD_NAME in legacyCommands) {
          legacyCommands[CMD_NAME as keyof legacyCommandsInterface](
            message,
            CMD_NAME,
            client,
            args,
          );
        } else {
          message.channel.send({
            embeds: [new CustomMessageEmbed().setTitle(":x: Wrong Command :x:").Error],
          });
        }
      }
    });
  } catch (err) {
    logError(throwCompleteErrorLog(err));
  }
};

export default legacyCommandHandler;
