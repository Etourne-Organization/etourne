import fs from 'fs';

import { ModalSubmitInteraction, Client } from 'discord.js';

// import buttonList from './buttonList';

export default async (
	client: Client,
	interaction: ModalSubmitInteraction,
): Promise<void> => {
	try {
		const { customId } = interaction;

		// const buttonFunction = buttonList.find((b) => b.customId === customId);

		// if (!buttonFunction) {
		// 	// await interaction.reply({ content: 'An error has occured [buttons]' });

		// 	return;
		// }

		// buttonFunction.run(client, interaction);
	} catch (err) {
		try {
			fs.appendFile(
				'logs/crash_logs.txt',
				`${new Date()} : Something went wrong in modalFormHandler.ts \n Actual error: ${err} \n \n`,
				(err) => {
					if (err) throw err;
				},
			);
		} catch (err) {
			console.log('Error logging failed');
		}
	}
};
