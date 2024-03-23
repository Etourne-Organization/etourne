import fs from 'fs';

import { BaseCommandInteraction, Client } from 'discord.js';

import slashCommandsList from './slashCommandsList';

export default async (
	client: Client,
	interaction: BaseCommandInteraction,
): Promise<void> => {
	try {
		const slashCommand = slashCommandsList.find(
			(c) => c.name === interaction.commandName,
		);

		if (!slashCommand) {
			await interaction.reply({
				content: 'An error has occured [slash commands]',
			});

			return;
		}

		slashCommand.run(client, interaction);
	} catch (err) {
		try {
			fs.appendFile(
				'logs/crash_logs.txt',
				`${new Date()} : Something went wrong in slashCommandHandler.ts \n Actual error: ${err} \n \n`,
				(err) => {
					if (err) throw err;
				},
			);
		} catch (err) {
			console.log('Error logging failed');
		}
	}
};
