import {
	Client,
	ButtonInteraction,
	MessageEmbed,
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
				file: 'teamEvent/setMaxNumTeams',
			});
		}
	},
};

export default setMaxNumTeams;
