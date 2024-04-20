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
import infoMessageEmbed, { types } from '../../../globalUtils/infoMessageEmbed';
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
				folder: 'buttonHandler/functions',
				file: 'teamEvent/setMaxNumTeamPlayers',
			});
		}
	},
};

export default setMaxNumTeamPlayers;
