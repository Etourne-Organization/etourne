import fs from 'fs';

require('dotenv').config();
import { Client, Intents, Constants, Message } from 'discord.js';

import commandHandler from './legacy-commands/commands';
import interactionCreate from './listener/interactionCreate';
import slashCommandsList from './slashCommands/slashCommandsList';
import guildCreate from './listener/guildCreate';
// import guildDelete from './listener/guildDelete';

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

	const guildId: string | any = process.env.GUILD_ID;
	const guild = client.guilds.cache.get(guildId);
	let commands;

	if (guild && guildId != undefined) {
		commands = guild.commands;
	} else {
		commands = client.application.commands;
	}

	await commands.set(slashCommandsList);

	console.log(`${client.user!.tag} has logged in BEEP BEEP 🤖`);

	try {
		fs.appendFile(
			'logs/restart.txt',
			`${new Date()} : Bot restarted \n`,
			(err) => {
				if (err) throw err;
			},
		);
	} catch (err) {
		console.log('Logging failed');
	}

	// set bot status
	client.user.setPresence({
		activities: [{ name: `/getstarted` }],
	});

	// run every 6 hours again to make sure it stays visible
	setInterval(() => {
		client.user?.setPresence({
			activities: [{ name: `/getstarted` }],
		});
	}, 1000 * 60 * 360);
});

client.on('messageCreate', (message: Message) =>
	commandHandler(message, client),
);

interactionCreate(client);
guildCreate(client);
// guildDelete(client);

client.login(process.env.DISCORDJS_BOT_TOKEN);

module.exports = { client };
