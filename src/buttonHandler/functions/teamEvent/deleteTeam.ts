import {
	Client,
	ButtonInteraction,
	MessageButton,
	MessageActionRow,
} from 'discord.js';

import logFile from '../../../globalUtils/logFile';
import { ButtonFunction } from '../../Button';
import infoMessageEmbed, { types } from '../../../globalUtils/infoMessageEmbed';
import {
	deleteTeam as deleteTeamSupabase,
	checkTeamExists,
} from '../../../supabase/supabaseFunctions/teams';
import { getUserRole } from '../../../supabase/supabaseFunctions/users';
import errorMessageTemplate from '../../../globalUtils/errorMessageTemplate';

const deleteTeam: ButtonFunction = {
	customId: 'deleteTeam',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
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
						infoMessageEmbed({
							title: ':warning: You are not allowed to use this button!',
							type: types.ERROR,
						}),
					],
					ephemeral: true,
				});
			}

			const teamId: string | any =
				interaction.message.embeds[0].footer?.text.split(' ')[2];

			const fetchedMessage = await interaction.channel?.messages.fetch(
				interaction.message.id,
			);

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
						infoMessageEmbed({
							title: ':question: Are you sure you want to delete your team?',
						}),
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

						if (await checkTeamExists({ teamId: teamId }))
							await deleteTeamSupabase({ teamId: parseInt(teamId) });

						await i.reply({
							embeds: [
								infoMessageEmbed({
									title: ':white_check_mark: Team deleted successfully!',
									type: types.SUCCESS,
								}),
							],
							ephemeral: true,
						});
					} else if (i.customId === 'deleteNo') {
						await interaction.deleteReply();

						await i.reply({
							embeds: [
								infoMessageEmbed({
									title: ':x: Team not deleted',
								}),
							],
							ephemeral: true,
						});
					}
				});
			} else {
				await interaction.reply({
					embeds: [
						infoMessageEmbed({
							title: ':x: Something went wrong',
							type: types.ERROR,
						}),
					],
					ephemeral: true,
				});
			}
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
				file: 'teamEvent/deleteTeam',
			});
		}
	},
};

export default deleteTeam;
