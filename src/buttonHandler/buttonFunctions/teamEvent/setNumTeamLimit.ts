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

const setNumTeamLimit: ButtonFunction = {
	customId: 'setNumTeamLimit',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			const eventId: string | any =
				interaction.message?.embeds[0].footer?.text.split(': ')[1];

			const numTeamLimit: any = await getColumnValueById({
				id: eventId,
				columnName: 'numTeamLimit',
			});

			const modal = new Modal()
				.setCustomId(`numTeamLimitModalSubmit-${interaction.id}`)
				.setTitle('Create Team');

			const teamLimitNumInput = new TextInputComponent()
				.setCustomId('numTeamLimit')
				.setLabel('Num of team limit')
				.setStyle('SHORT')
				// .setValue('123')
				.setPlaceholder('Enter limit for num of team')
				.setValue(numTeamLimit[0]['numTeamLimit'].toString());

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

export default setNumTeamLimit;
