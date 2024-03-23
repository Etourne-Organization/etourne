import fs from 'fs';

import {
	Client,
	ButtonInteraction,
	Modal,
	TextInputComponent,
	MessageActionRow,
	ModalActionRowComponent,
} from 'discord.js';

import { ButtonFunction } from '../../Button';
import { getColumnValueById } from '../../../supabase/supabaseFunctions/events';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';
import errorMessageTemplate from '../../../globalUtils/errorMessageTemplate';

const setMaxNumTeamPlayers: ButtonFunction = {
	customId: 'setMaxNumTeamPlayers',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			const eventId: string | any =
				interaction.message?.embeds[0].footer?.text.split(': ')[1];

			const maxNumTeamPlayers: any = await getColumnValueById({
				id: eventId,
				columnName: 'maxNumTeamPlayers',
			});

			const modal = new Modal()
				.setCustomId(`setMaxNumTeamPlayersModalSubmit-${interaction.id}`)
				.setTitle('Create Team');

			const maxNumTeamPlayersInput = new TextInputComponent()
				.setCustomId('maxNumTeamPlayers')
				.setLabel('Max num of team players')
				.setStyle('SHORT')
				.setPlaceholder('Enter max num of team players in each team')
				.setValue(
					maxNumTeamPlayers[0]['maxNumTeamPlayers']
						? maxNumTeamPlayers[0]['maxNumTeamPlayers'].toString()
						: '',
				);

			const maxNumTeamPlayersActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					maxNumTeamPlayersInput,
				);

			modal.addComponents(maxNumTeamPlayersActionRow);

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

export default setMaxNumTeamPlayers;
