import { BaseCommandInteraction, Client, Interaction } from 'discord.js';

import allSlashCommands from './allSlashCommands';

export default async (
	client: Client,
	interaction: BaseCommandInteraction,
): Promise<void> => {
	try {
		const slashCommand = allSlashCommands.find(
			(c) => c.name === interaction.commandName,
		);

		if (!slashCommand) {
			await interaction.reply({ content: 'An error has occured' });

			return;
		}

		slashCommand.run(client, interaction);
	} catch (err) {
		console.log({
			actualError: err,
			message: 'Something went wrong in slashCommandHandler.ts',
		});
	}
};
