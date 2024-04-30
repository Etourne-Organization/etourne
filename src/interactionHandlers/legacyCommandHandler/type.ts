import { Client, Message } from "discord.js";

export interface legacyCommands {
  botInfo: (message: Message, CMD_NAME: string, client: Client, args: [] | unknown) => void;
}
