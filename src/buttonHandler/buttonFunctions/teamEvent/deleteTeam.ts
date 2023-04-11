import fs from 'fs';

import {
	Client,
	ButtonInteraction,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
} from 'discord.js';

import { ButtonFunction } from '../../ButtonStructure';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';
import { deleteTeam as deleteTeamSupabase } from '../../../supabase/supabaseFunctions/teams';

const deleteTeam: ButtonFunction = {
	customId: 'deleteTeam',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			const teamLeaderUsername: any =
				interaction.message.embeds[0].fields?.find(
					(r) => r.name === 'Team Leader',
				)?.value;

			if (teamLeaderUsername !== interaction.user.tag) {
				return interaction.reply({
					embeds: [
						infoMessageEmbed(
							'You are not allowed to use this button!',
							'WARNING',
						),
					],
					ephemeral: true,
				});
			}

			const fetchedMessage = await interaction.channel?.messages.fetch(
				interaction.message.id,
			);

			const teamId: string | any =
				interaction.message.embeds[0].footer?.text.split(': ')[2];

			if (fetchedMessage) {
				const confirmationButtons = new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId('deleteYes')
						.setLabel('✔')
						.setStyle('PRIMARY'),
					new MessageButton()
						.setCustomId('deleteNo')
						.setLabel('✖')
						.setStyle('SECONDARY'),
				);

				await interaction.reply({
					embeds: [
						infoMessageEmbed(
							'Are you sure you want to delete your team?',
						),
					],
					components: [confirmationButtons],
					ephemeral: true,
				});

				const filter: any = (i: ButtonInteraction) =>
					(i.customId === 'deleteYes' || i.customId === 'deleteNo') &&
					i.user.id === interaction.user.id;

				const collector =
					interaction.channel?.createMessageComponentCollector({
						filter,
						time: 15000,
						max: 1,
						maxComponents: 1,
					});

				collector?.on('collect', async (i: ButtonInteraction) => {
					if (i.customId === 'deleteYes') {
						await fetchedMessage.delete();

						await interaction.deleteReply();

						deleteTeamSupabase({ teamId: parseInt(teamId) });

						await i.reply({
							embeds: [
								infoMessageEmbed(
									':white_check_mark: Team deleted successfully!',
									'SUCCESS',
								),
							],
							ephemeral: true,
						});
					} else if (i.customId === 'deleteNo') {
						await interaction.deleteReply();

						await i.reply({
							embeds: [infoMessageEmbed(':x: Team not deleted')],
							ephemeral: true,
						});
					}
				});
			} else {
				await interaction.reply({
					embeds: [infoMessageEmbed('Something went wrong', 'WARNING')],
					ephemeral: true,
				});
			}
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in buttonFunctions/teamEvent/deleteTeam.ts \n Actual error: ${err} \n \n`,
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

export default deleteTeam;
