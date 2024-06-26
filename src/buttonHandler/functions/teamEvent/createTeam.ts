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
import { getNumOfTeams } from '../../../supabase/supabaseFunctions/teams';
import { getColumnValueById } from '../../../supabase/supabaseFunctions/events';
import infoMessageEmbed, { types } from '../../../globalUtils/infoMessageEmbed';
import errorMessageTemplate, {
	MessageType,
} from '../../../globalUtils/errorMessageTemplate';

const createTeam: ButtonFunction = {
	customId: 'createTeam',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			const eventId: string | any =
				interaction.message.embeds[0].footer?.text.split(': ')[1];

			const maxNumTeams: any = await getColumnValueById({
				id: eventId,
				columnName: 'maxNumTeams',
			});

			if (
				maxNumTeams.length > 0 &&
				(await getNumOfTeams({ eventId: eventId })) ===
					maxNumTeams[0]['maxNumTeams']
			) {
				return await interaction.reply({
					embeds: [
						infoMessageEmbed({
							title: ':warning: Number of team has reached the limit!',
							type: types.ERROR,
						}),
					],
					ephemeral: true,
				});
			}

			const teamFormModal = new Modal()
				.setCustomId(`teamModalSubmit-${interaction.id}`)
				.setTitle('Create Team');

			const teamNameInput = new TextInputComponent()
				.setCustomId('teamName')
				.setLabel('Team Name')
				.setStyle('SHORT')
				.setPlaceholder('Enter team name')
				.setRequired(true);

			const teamSmallDescriptionInput = new TextInputComponent()
				.setCustomId('teamShortDescription')
				.setLabel('Team Short Description')
				.setStyle('SHORT')
				.setPlaceholder('Enter short team description')
				.setRequired(true);

			const teamNameActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					teamNameInput,
				);

			const teamSmallDescriptionActionRow =
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					teamSmallDescriptionInput,
				);

			teamFormModal.addComponents(
				teamNameActionRow,
				teamSmallDescriptionActionRow,
			);

			await interaction.showModal(teamFormModal);
		} catch (err) {
			await interaction.reply({
				embeds: [
					infoMessageEmbed({
						title: errorMessageTemplate({
							messageType: MessageType.SHORT,
						}).title,
						description: errorMessageTemplate({
							messageType: MessageType.SHORT,
						}).description,
						type: types.ERROR,
					}),
				],
				ephemeral: true,
			});

			logFile({
				error: err,
				folder: 'buttonHandler/functions',
				file: 'teamEvent/createTeam',
			});
		}
	},
};

export default createTeam;
