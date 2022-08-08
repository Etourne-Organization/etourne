require('dotenv').config();
import { Client, Intents, Constants, Message } from 'discord.js';

import commandHandler from './legacy-commands/commands';
import interactionCreate from './slash-commands/listener/interactionCreate';

const client = new Client({
	partials: ['MESSAGE', 'REACTION'],
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_MESSAGE_TYPING,
	],
});

client.on('ready', async () => {
	if (!client.user || !client.application) {
		return;
	}

	console.log(`${client.user!.tag} has logged in BEEP BEEP 🤖`);
});

client.on('messageCreate', (message: Message) =>
	commandHandler(message, client),
);

interactionCreate(client);

client.login(process.env.DISCORDJS_BOT_TOKEN);

module.exports = { client };
