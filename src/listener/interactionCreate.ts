import { Client, Interaction } from 'discord.js';

import slashCommandHandler from '../slash-commands/slashCommandHandler';
import buttonHandler from '../buttonHandler/buttonHandler';

export default (client: Client): void => {
	client.on('interactionCreate', async (interaction: Interaction) => {
		if (interaction.isCommand() || interaction.isContextMenu()) {
			await slashCommandHandler(client, interaction);
		}

		if (interaction.isButton()) {
			await buttonHandler(client, interaction);
		}
	});
};
