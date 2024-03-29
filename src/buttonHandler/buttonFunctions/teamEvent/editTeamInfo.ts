import fs from 'fs';

import {
	Client,
	ButtonInteraction,
	Modal,
	TextInputComponent,
	MessageActionRow,
	ModalActionRowComponent,
} from 'discord.js';

import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';
import { ButtonFunction } from '../../ButtonStructure';
import {
	checkTeamExists,
	getAllColumnValueById,
} from '../../../supabase/supabaseFunctions/teams';
import { getUserRole } from '../../../supabase/supabaseFunctions/users';
import errorMessageTemplate from '../../../globalUtils/errorMessageTemplate';

const editTeamInfo: ButtonFunction = {
	customId: 'editTeamInfo',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			const teamId: string | any =
				interaction.message.embeds[0].footer?.text.split(' ')[2];
			const eventId: string | any =
				interaction.message.embeds[0].footer?.text.split(' ')[5];

			if (!(await checkTeamExists({ teamId: parseInt(teamId) }))) {
				return interaction.reply({
					embeds: [
						infoMessageEmbed(
							':warning: The team does not exist anymore, maybe it was deleted?',
							'WARNING',
						),
					],
					ephemeral: true,
				});
			}

			const teamLeader:
				| {
						name: string;
						value: string;
						inline: boolean;
				  }
				| any = interaction.message?.embeds[0].fields?.find(
				(r) => r.name === 'Team Leader',
			);

			// check user role in DB
			const userRoleDB: any = await getUserRole({
				discordUserId: interaction.user.id,
				discordServerId: interaction.guild!.id,
			});

			if (
				interaction.user.tag !== teamLeader.value &&
				(userRoleDB.length === 0 ||
					(userRoleDB[0]['roleId'] !== 3 && userRoleDB[0]['roleId'] !== 2))
			) {
				return interaction.reply({
					embeds: [
						infoMessageEmbed(
							':warning: You are not allowed to use this button!',
							'WARNING',
						),
					],
					ephemeral: true,
				});
			}

			const allColumnValue = await getAllColumnValueById({ id: teamId });

			const teamFormModal = new Modal()
				.setCustomId(`editTeamInfoModal-${interaction.id}`)
				.setTitle('Create Team');

			const teamNameInput = new TextInputComponent()
				.setCustomId('teamName')
				.setLabel('Team Name')
				.setStyle('SHORT')
				.setPlaceholder('Enter team name')
				.setValue(allColumnValue[0]['name']);

			const teamSmallDescriptionInput = new TextInputComponent()
				.setCustomId('teamShortDescription')
				.setLabel('Team Short Description')
				.setStyle('SHORT')
				.setPlaceholder('Enter short team description')
				.setValue(allColumnValue[0]['description']);

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
					infoMessageEmbed(
						errorMessageTemplate().title,
						'ERROR',
						errorMessageTemplate().description,
					),
				],
				ephemeral: true,
			});

			try {
				console.log(err);
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in buttonFunctions/teamEvent/editTeamInfo.ts \n Actual error: ${err} \n \n`,
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

export default editTeamInfo;
