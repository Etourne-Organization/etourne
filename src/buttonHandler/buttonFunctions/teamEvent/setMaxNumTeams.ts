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
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';
import errorMessageTemplate from '../../../globalUtils/errorMessageTemplate';

const setMaxNumTeams: ButtonFunction = {
	customId: 'setMaxNumTeams',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			const eventId: string | any =
				interaction.message?.embeds[0].footer?.text.split(': ')[1];

			const maxNumTeams: any = await getColumnValueById({
				id: eventId,
				columnName: 'maxNumTeams',
			});

			const modal = new Modal()
				.setCustomId(`setMaxNumTeamsModalSubmit-${interaction.id}`)
				.setTitle('Create Team');

			const maxNumTeamsInput = new TextInputComponent()
				.setCustomId('maxNumTeams')
				.setLabel('Max num of teams')
				.setStyle('SHORT')
				// .setValue('123')
				.setPlaceholder('Enter max num of teams')
				.setValue(
					maxNumTeams[0]['maxNumTeams']
						? maxNumTeams[0]['maxNumTeams'].toString()
						: '',
				);

			const maxNumTeamsLimitActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					maxNumTeamsInput,
				);

			modal.addComponents(maxNumTeamsLimitActionRow);

			await interaction.showModal(modal);
		} catch (err) {
			await interaction.reply({
				embeds: [
					infoMessageEmbed(
						errorMessageTemplate().title,
						'ERROR',
						errorMessageTemplate().description,
					),
				],
				ephemeral: true,
			});

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

export default setMaxNumTeams;
