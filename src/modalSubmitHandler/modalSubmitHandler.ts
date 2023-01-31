import fs from 'fs';

import { ModalSubmitInteraction, Client } from 'discord.js';

import modalSubmitFunctionList from './modalSubmitFunctionList';

export default async (
	client: Client,
	interaction: ModalSubmitInteraction,
): Promise<void> => {
	try {
		const { customId } = interaction;

		const modalSubmitFunction = modalSubmitFunctionList.find((m) => {
			const temp = customId.split('-');

			if (temp.indexOf(m.customId) !== -1) {
				return m;
			}
		});

		if (!modalSubmitFunction) {
			// await interaction.reply({ content: 'An error has occured [modalSubmit]' });

			return;
		}

		modalSubmitFunction.run(client, interaction);
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
