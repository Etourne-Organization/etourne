import { Client, Interaction } from 'discord.js';

import slashCommandHandler from '../slashCommands';
import buttonHandler from '../buttonHandler';
import modalSubmitHandler from '../modalSubmitHandler';
import selectMenuHandler from '../selectMenuHandler';

export default (client: Client): void => {
	client.on('interactionCreate', async (interaction: Interaction) => {
		if (interaction.isCommand() || interaction.isContextMenu()) {
			await slashCommandHandler(client, interaction);
		}

		if (interaction.isButton()) {
			await buttonHandler(client, interaction);
		}

		if (interaction.isModalSubmit()) {
			await modalSubmitHandler(client, interaction);
		}

		if (interaction.isSelectMenu()) {
			await selectMenuHandler(client, interaction);
		}
	});
};
