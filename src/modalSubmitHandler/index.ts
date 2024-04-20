import { ModalSubmitInteraction, Client } from 'discord.js';

import modalSubmitFunctionList from './modalSubmitList';
import logFile from '../globalUtils/logFile';

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
			logFile({
				error: err,
				folder: 'modalSubmitHandler',
				file: 'index',
			});
		} catch (err) {
			console.log('Error logging failed');
		}
	}
};
