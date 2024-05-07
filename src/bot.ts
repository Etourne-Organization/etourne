import { Client, Intents } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config(); // ? must be above client events to ensure supabase works

import generateListeners from "./bot.listeners";
import slashCommandsList from "./interactionHandlers/slashCommandHandler/slashCommandList";

const startTime = new Date().getTime();

const client = new Client({
  partials: ["MESSAGE", "REACTION"],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
  ],
});

client.once("ready", async () => {
  if (!client.user || !client.application) return;

  const guildId = process.env.GUILD_ID || "";
  const guild = client.guilds.cache.get(guildId);
  const commands = guild ? guild.commands : client.application.commands;

  const setupCommandsStart = new Date().getTime();
  const setupCommandsTime = ((setupCommandsStart - startTime) / 1000).toFixed(3);
  console.log(`[+${setupCommandsTime}s] Setting up slash commands 🤖`);

  await commands.set(slashCommandsList);

  const loginTime = new Date().getTime();
  const loginTimeDiff = ((loginTime - setupCommandsStart) / 1000).toFixed(3);
  console.log(`[+${loginTimeDiff}s] ${client.user!.tag} has logged in BEEP BEEP 🤖`);

  try {
    fs.appendFileSync("logs/restart.txt", `[${new Date()}] Bot restarted \n`);
  } catch (err) {
    console.log("Logging failed");
  }

  // Set bot status
  const setBotPresence = () =>
    client.user?.setPresence({
      activities: [{ name: `/getstarted` }],
    });

  setBotPresence();

  // Refresh presence every 6 hours
  setInterval(setBotPresence, 21600000);
});

generateListeners(client);

console.log("[+0.000s] Logging in 🤖");

client.login(process.env.DISCORDJS_BOT_TOKEN);
