import fs from 'fs';

import { Client, ButtonInteraction, MessageEmbed } from 'discord.js';

import { ButtonFunction } from '../../ButtonStructure';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';
import { addPlayer } from '../../../supabase/supabaseFunctions/teamPlayers';
import { checkTeamExists } from '../../../supabase/supabaseFunctions/teams';

const registerTeamMember: ButtonFunction = {
	customId: 'registerTeamMember',
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

			const registeredPlayers: any =
				interaction.message.embeds[0].fields?.find(
					(r) => r.name === 'Registered players',
				);

			const tempSplit = registeredPlayers.value.split(' ');

			// will be helpful for checking if the member is already registered
			const playersSplitted: string[] =
				tempSplit.length <= 1 && tempSplit[0].length < 1
					? ['']
					: tempSplit[1].includes('\n')
					? tempSplit[1].split('\n')
					: [tempSplit[1]];

			if (playersSplitted.indexOf(interaction.user.tag) !== -1) {
				return await interaction.reply({
					embeds: [
						infoMessageEmbed('You are already registered!', 'WARNING'),
					],
					ephemeral: true,
				});
			}

			tempSplit.push(`${interaction.user.tag}\n`);
			tempSplit.shift();

			/* assigning updated player list back to the orignal embed field */
			interaction.message.embeds[0].fields?.find((r) => {
				if (r.name === 'Registered players') {
					r.value = Array.isArray(tempSplit)
						? '>>> ' + tempSplit.join('\n')
						: '>>> ' + tempSplit;
				}
			});

			await addPlayer({
				username: interaction.user.tag,
				discordUserId: interaction.user.id,
				teamId: parseInt(teamId),
				discordServerId: interaction.guild?.id!,
			});

			const editedEmbed = new MessageEmbed()
				.setColor('#3a9ce2')
				.setTitle(interaction.message.embeds[0].title || 'Undefined')
				.setDescription(
					interaction.message.embeds[0].description || 'Undefined',
				)
				.addFields(interaction.message.embeds[0].fields || [])
				.setFooter({ text: `${footer}` });

			return await interaction.update({ embeds: [editedEmbed] });
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

export default registerTeamMember;
