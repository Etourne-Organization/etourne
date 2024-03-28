import {
	Client,
	ButtonInteraction,
	Modal,
	TextInputComponent,
	MessageActionRow,
	ModalActionRowComponent,
} from 'discord.js';

import logFile from '../../../globalUtils/logFile';
import { ButtonFunction } from '../../Button';
import { getColumnValueById } from '../../../supabase/supabaseFunctions/events';
import errorMessageTemplate from '../../../globalUtils/errorMessageTemplate';
import infoMessageEmbed, { types } from '../../../globalUtils/infoMessageEmbed';

const setMaxNumPlayers: ButtonFunction = {
	customId: 'setMaxNumPlayers',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			const eventId: string | any =
				interaction.message.embeds[0].footer?.text.split(': ')[1];

			const maxNumPlayers: any = await getColumnValueById({
				id: eventId,
				columnName: 'maxNumPlayers',
			});

			const modal = new Modal()
				.setCustomId(`maxNumPlayersModalSubmit-${interaction.id}`)
				.setTitle('Create Team');

			const input = new TextInputComponent()
				.setCustomId('maxNumPlayersInput')
				.setLabel('Num of team member limit')
				.setStyle('SHORT')
				.setPlaceholder('Enter limit for num of team members in each team')
				.setValue(
					maxNumPlayers[0]['maxNumPlayers']
						? maxNumPlayers[0]['maxNumPlayers'].toString()
						: '',
				);

			const teamMemberLimitNumActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					input,
				);

			modal.addComponents(teamMemberLimitNumActionRow);

			await interaction.showModal(modal);
		} catch (err) {
			await interaction.reply({
				embeds: [
					infoMessageEmbed({
						title: errorMessageTemplate().title,
						description: errorMessageTemplate().description,
						type: types.ERROR,
					}),
				],
				ephemeral: true,
			});

			logFile({
				error: err,
				folder: 'buttonHandler/buttonFunctions',
				file: 'normalEvent/setMaxNumPlayers',
			});
		}
	},
};

export default setMaxNumPlayers;
