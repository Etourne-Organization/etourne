import fs from 'fs';

import { Client, ButtonInteraction, MessageEmbed } from 'discord.js';

import { ButtonFunction } from '../../ButtonStructure';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';

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
				});
			}

			const fetchedMessage = await interaction.channel?.messages.fetch(
				interaction.message.id,
			);

			if (fetchedMessage) {
				// const filter: any = (i: ButtonInteraction) =>
				// 	i.customId === 'deleteTeam' && i.user.id === interaction.user.id;

				// const collector =
				// 	interaction.channel?.createMessageComponentCollector({
				// 		filter,
				// 		time: 15000,
				// 	});

				await fetchedMessage.delete();
				await interaction.reply({
					embeds: [
						infoMessageEmbed('Team deleted successfully', 'SUCCESS'),
					],
					ephemeral: true,
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
					`${new Date()} : Something went wrong in buttonFunctions/teamEvent/registerTeamMember.ts \n Actual error: ${err} \n \n`,
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
