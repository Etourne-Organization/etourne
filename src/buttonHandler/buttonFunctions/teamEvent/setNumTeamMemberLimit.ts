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
import { getColumnValueById } from '../../../supabase/supabaseFunctions/events';

const setNumTeamMemberLimit: ButtonFunction = {
	customId: 'setNumTeamMemberLimit',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			const eventId: string | any =
				interaction.message?.embeds[0].footer?.text.split(': ')[1];

			const numTeamMemberLimit: any = await getColumnValueById({
				id: eventId,
				columnName: 'numTeamMemberLimit',
			});

			const modal = new Modal()
				.setCustomId(`numTeamMemberLimitModalSubmit-${interaction.id}`)
				.setTitle('Create Team');

			const teamMemberLimitNumInput = new TextInputComponent()
				.setCustomId('numTeamMemberLimit')
				.setLabel('Num of team member limit')
				.setStyle('SHORT')
				.setPlaceholder('Enter limit for num of team members in each team')
				.setValue(
					numTeamMemberLimit[0]['numTeamMemberLimit']
						? numTeamMemberLimit[0]['numTeamMemberLimit'].toString()
						: '',
				);

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
