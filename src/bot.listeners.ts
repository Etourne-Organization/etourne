import { Client } from "discord.js";
import legacyCommandHandler from "./interactionHandlers/legacyCommandHandler/commands";
import onNewGuild from "./listeners/guildCreate";
import registerInteractionHandlers from "./listeners/interactionCreate";

export default function generateListeners(client: Client) {
  registerInteractionHandlers(client);
  onNewGuild(client);
  legacyCommandHandler(client);
  // guildDelete(client);
}
