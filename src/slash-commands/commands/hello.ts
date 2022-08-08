import { BaseCommandInteraction, Client } from 'discord.js';
import { Command } from '../CommandStructure';

const hello: Command = {
	name: 'hello',
	description: 'Returns a greeting',
	type: 'CHAT_INPUT',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		const content = 'Hello there';

		await interaction.reply({
			content: content,
			ephemeral: true,
		});
	},
};

export default hello;
