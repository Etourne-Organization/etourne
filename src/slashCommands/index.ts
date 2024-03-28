import { BaseCommandInteraction, Client } from 'discord.js';

import slashCommandsList from './slashCommandsList';
import logFile from '../globalUtils/logFile';

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
			logFile({
				error: err,
				folder: 'slashCommands',
				file: 'index',
			});
		} catch (err) {
			console.log('Error logging failed');
		}
	}
};
