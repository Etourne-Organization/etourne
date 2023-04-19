import fs from 'fs';

import {
	Client,
	ButtonInteraction,
	Modal,
	TextInputComponent,
	MessageActionRow,
	ModalActionRowComponent,
} from 'discord.js';

import { ButtonFunction } from '../../ButtonStructure';
import { getNumOfTeam } from '../../../supabase/supabaseFunctions/teams';
import { getColumnValueById } from '../../../supabase/supabaseFunctions/events';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';

const createTeam: ButtonFunction = {
	customId: 'createTeam',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			const eventId: string | any =
				interaction.message.embeds[0].footer?.text.split(': ')[1];

			const numTeamLimit: any = await getColumnValueById({
				id: eventId,
				columnName: 'numTeamLimit',
			});

			if (
				numTeamLimit.length > 0 &&
				(await getNumOfTeam({ eventId: eventId })) ===
					numTeamLimit[0]['numTeamLimit']
			) {
				return await interaction.reply({
					embeds: [
						infoMessageEmbed(
							'Number of team has reached the limit!',
							'WARNING',
						),
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
				.setPlaceholder('Enter team name');

			const teamSmallDescriptionInput = new TextInputComponent()
				.setCustomId('teamShortDescription')
				.setLabel('Team Short Description')
				.setStyle('SHORT')
				.setPlaceholder('Enter short team description');

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
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in buttonFunctions/teamEvent/createTeam.ts \n Actual error: ${err} \n \n`,
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

export default createTeam;
