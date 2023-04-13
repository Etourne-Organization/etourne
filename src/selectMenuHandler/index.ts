import fs from 'fs';

import { SelectMenuInteraction, Client } from 'discord.js';

import selectMenuList from './selectMenuList';

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
		try {
			fs.appendFile(
				'logs/crash_logs.txt',
				`${new Date()} : Something went wrong in buttonHandler.ts \n Actual error: ${err} \n \n`,
				(err) => {
					if (err) throw err;
				},
			);
		} catch (err) {
			console.log('Error logging failed');
		}
	}
};
