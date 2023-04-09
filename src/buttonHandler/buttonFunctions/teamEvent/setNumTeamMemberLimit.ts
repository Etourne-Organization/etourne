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

const setNumTeamMemberLimit: ButtonFunction = {
	customId: 'setTeamMemberNumLimit',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			const modal = new Modal()
				.setCustomId(`teamMemberNumLimitModalSubmit-${interaction.id}`)
				.setTitle('Create Team');

			const teamMemberLimitNumInput = new TextInputComponent()
				.setCustomId('teamMemberNumLimit')
				.setLabel('Team member num limit')
				.setStyle('SHORT')
				.setPlaceholder('Enter limit for num of team members in each team');

			const teamMemberLimitNumActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					teamMemberLimitNumInput,
				);

			modal.addComponents(teamMemberLimitNumActionRow);

			await interaction.showModal(modal);
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in buttonFunctions/teamEvent/setTeamMemberNumLimit.ts \n Actual error: ${err} \n \n`,
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

export default setNumTeamMemberLimit;
