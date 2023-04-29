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

const setMaxNumPlayer: ButtonFunction = {
	customId: 'setMaxNumPlayer',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			const eventId: string | any =
				interaction.message.embeds[0].footer?.text.split(': ')[1];

			const maxNumPlayer: any = await getColumnValueById({
				id: eventId,
				columnName: 'maxNumPlayer',
			});

			const modal = new Modal()
				.setCustomId(`maxNumPlayerModalSubmit-${interaction.id}`)
				.setTitle('Create Team');

			const input = new TextInputComponent()
				.setCustomId('maxNumPlayerInput')
				.setLabel('Num of team member limit')
				.setStyle('SHORT')
				.setPlaceholder('Enter limit for num of team members in each team')
				.setValue(
					maxNumPlayer[0]['maxNumPlayer']
						? maxNumPlayer[0]['maxNumPlayer'].toString()
						: '',
				);

			const teamMemberLimitNumActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					input,
				);

			modal.addComponents(teamMemberLimitNumActionRow);

			await interaction.showModal(modal);
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in buttonFunctions/normalEvent/setMaxNumPlayer.ts \n Actual error: ${err} \n \n`,
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

export default setMaxNumPlayer;
