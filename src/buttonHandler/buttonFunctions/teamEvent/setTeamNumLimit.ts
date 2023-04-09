import fs from 'fs';

import {
	Client,
	ButtonInteraction,
	MessageEmbed,
	Modal,
	TextInputComponent,
	MessageActionRow,
	ModalActionRowComponent,
} from 'discord.js';

import { ButtonFunction } from '../../ButtonStructure';

const setTeamNumLimit: ButtonFunction = {
	customId: 'setTeamNumLimit',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			const modal = new Modal()
				.setCustomId(`teamNumLimitModalSubmit-${interaction.id}`)
				.setTitle('Create Team');

			const teamLimitNumInput = new TextInputComponent()
				.setCustomId('teamNumLimit')
				.setLabel('Team num limit')
				.setStyle('SHORT')
				// .setValue('123')
				.setPlaceholder('Enter limit for num of team');

			const teamLimitNumActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					teamLimitNumInput,
				);

			modal.addComponents(teamLimitNumActionRow);

			await interaction.showModal(modal);
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in buttonFunctions/teamEvent/setTeamNumLimit.ts \n Actual error: ${err} \n \n`,
					(err) => {
						if (err) throw err;
					},
				);
			} catch (err) {
				console.log('Error logging failed');
			}
		}
	},
};

export default setTeamNumLimit;
