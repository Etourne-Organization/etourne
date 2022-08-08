import { Client, Interaction } from 'discord.js';

import slashCommandHandler from '../slashCommandHandler';

export default (client: Client): void => {
	client.on('interactionCreate', async (interaction: Interaction) => {
		if (interaction.isCommand() || interaction.isContextMenu()) {
			await slashCommandHandler(client, interaction);
		}
	});
};
