import { SelectMenuInteraction, Client } from 'discord.js';

import selectMenuList from './selectMenuList';
import logFile from '../globalUtils/logFile';

export default async (
	client: Client,
	interaction: SelectMenuInteraction,
): Promise<void> => {
	try {
		const { customId } = interaction;

		const selectMenuFunction = selectMenuList.find(
			(b) => b.customId === customId,
		);

		if (!selectMenuFunction) {
			return;
		}

		selectMenuFunction.run(client, interaction);
	} catch (err) {
		logFile({
			error: err,
			folder: 'selectMenuHandler',
			file: 'index',
		});
	}
};
