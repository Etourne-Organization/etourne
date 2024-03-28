import {
	Client,
	ButtonInteraction,
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu,
} from 'discord.js';

import logFile from '../../../globalUtils/logFile';
import { ButtonFunction } from '../../Button';
import infoMessageEmbed, { types } from '../../../globalUtils/infoMessageEmbed';
import { checkTeamExists } from '../../../supabase/supabaseFunctions/teams';
import { getAllTeamPlayers } from '../../../supabase/supabaseFunctions/teamPlayers';
import { getUserRole } from '../../../supabase/supabaseFunctions/users';
import errorMessageTemplate from '../../../globalUtils/errorMessageTemplate';

const removeTeamPlayer: ButtonFunction = {
	customId: 'removeTeamPlayer',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			const footer = interaction.message.embeds[0].footer?.text;
			const teamId: string | any =
				interaction.message.embeds[0].footer?.text.split(' ')[2];

			if (!(await checkTeamExists({ teamId: parseInt(teamId) }))) {
				return interaction.reply({
					embeds: [
						infoMessageEmbed({
							title: 'The team does not exist anymore, maybe it was deleted?',
							type: types.ERROR,
						}),
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
						infoMessageEmbed({
							title: ':warning: You are not allowed use this button!',
							type: types.ERROR,
						}),
					],
					ephemeral: true,
				});
			}

			const teamPlayers: [{ username: string; userId: string }] | any =
				await getAllTeamPlayers({
					teamId: parseInt(teamId),
				});

			if (!(teamPlayers!.length > 0))
				return interaction.reply({
					embeds: [
						infoMessageEmbed({
							title: ':warning: There are no team players to remove!',
							type: types.ERROR,
						}),
					],
					ephemeral: true,
				});

			const selectMenuOptions: Array<{
				label: string;
				description: string;
				value: string;
			}> = [];

			teamPlayers!.forEach(
				(tp: { username: string; userId: string }, i: number) => {
					if (tp.username === interaction.user.tag) return;

					selectMenuOptions.push({
						label: tp.username,
						description: `Remove ${tp.username}`,
						value: `${tp.username}||${tp.userId}`,
					});
				},
			);

			const selectMenu = new MessageActionRow().addComponents(
				new MessageSelectMenu()
					.setCustomId('removeTeamPlayer')
					.setPlaceholder('Select a player to be removed')
					.addOptions(selectMenuOptions),
			);

			const selectMessageEmbed = new MessageEmbed()
				.setTitle('Select team player to be removed')
				.setColor('#3A9CE2')
				.setFooter({ text: `${footer}` })
				.setTimestamp();

			await interaction.reply({
				embeds: [selectMessageEmbed],
				ephemeral: true,
				components: [selectMenu],
			});
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
				file: 'teamEvent/removeTeamPlayer',
			});
		}
	},
};

export default removeTeamPlayer;
