import fs from 'fs';

import { Client, ButtonInteraction, MessageEmbed } from 'discord.js';

import { ButtonFunction } from '../../ButtonStructure';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';
import { removePlayer } from '../../../supabase/supabaseFunctions/teamPlayers';
import { checkTeamExists } from '../../../supabase/supabaseFunctions/teams';

const unregisterTeamMember: ButtonFunction = {
	customId: 'unregisterTeamMember',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			const footer = interaction.message.embeds[0].footer?.text;
			const teamId: string | any =
				interaction.message.embeds[0].footer?.text.split(' ')[2];

			if (!(await checkTeamExists({ teamId: parseInt(teamId) }))) {
				return interaction.reply({
					embeds: [
						infoMessageEmbed(
							'The team does not exist anymore, maybe it was deleted?',
							'WARNING',
						),
					],
					ephemeral: true,
				});
			}

			let FOUND: boolean = false;
			const registeredPlayers: any =
				interaction.message.embeds[0].fields?.find((r) =>
					r.name.includes('Registered players'),
				);

			const tempSplit: Array<string> = registeredPlayers.value.split(' ');

			const playersSplitted: Array<string> =
				tempSplit.length <= 1 && tempSplit[0].length < 1
					? ['']
					: tempSplit[1].includes('\n')
					? tempSplit[1].split('\n')
					: [tempSplit[1]];

			const playerIndex = playersSplitted.indexOf(interaction.user.tag);

			if (playerIndex !== -1) {
				playersSplitted.splice(playerIndex, 1);

				/* assigning updated player list back to the orignal embed field */
				interaction.message.embeds[0].fields?.find((r) => {
					if (r.name.includes('Registered players')) {
						let numRegisteredPlayers: number = parseInt(
							r.name.split(' ')[2].split('/')[0],
						);
						const maxNumTeamPlayers = r.name.split(' ')[2].split('/')[1];

						numRegisteredPlayers -= 1;

						r.name = `Registered players ${numRegisteredPlayers}/${maxNumTeamPlayers}`;
						r.value =
							playersSplitted.length >= 1
								? '>>> ' + playersSplitted.join('\n')
								: ' ';
					}
				});

				await removePlayer({
					discordUserId: interaction.user.id,
					teamId: parseInt(teamId),
				});

				const editedEmbed = new MessageEmbed()
					.setColor('#3a9ce2')
					.setTitle(interaction.message.embeds[0].title || 'Undefined')
					.setDescription(
						interaction.message.embeds[0].description || 'Undefined',
					)
					.addFields(interaction.message.embeds[0].fields || [])
					.setFooter({ text: `${footer}` });

				FOUND = true;
				return await interaction.update({ embeds: [editedEmbed] });
			}

			if (!FOUND) {
				return await interaction.reply({
					embeds: [infoMessageEmbed('You are not registered!', 'WARNING')],
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

export default unregisterTeamMember;
