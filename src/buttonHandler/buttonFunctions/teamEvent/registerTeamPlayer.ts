import fs from 'fs';

import { Client, ButtonInteraction, MessageEmbed } from 'discord.js';

import { ButtonFunction } from '../../ButtonStructure';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';
import {
	addPlayer,
	getNumOfTeamPlayers,
} from '../../../supabase/supabaseFunctions/teamPlayers';
import { getColumnValueById } from '../../../supabase/supabaseFunctions/events';
import { checkTeamExists } from '../../../supabase/supabaseFunctions/teams';

const registerTeamPlayer: ButtonFunction = {
	customId: 'registerTeamPlayer',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			const footer = interaction.message.embeds[0].footer?.text;
			const teamId: string | any =
				interaction.message.embeds[0].footer?.text.split(' ')[2];
			const eventId: string | any =
				interaction.message.embeds[0].footer?.text.split(' ')[5];

			const maxNumTeamPlayers: any = await getColumnValueById({
				id: eventId,
				columnName: 'maxNumTeamPlayers',
			});

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

			if (
				maxNumTeamPlayers.length > 0 &&
				(await getNumOfTeamPlayers({ teamId: teamId })) ===
					maxNumTeamPlayers[0]['maxNumTeamPlayers']
			) {
				return await interaction.reply({
					embeds: [
						infoMessageEmbed(
							'Number of players has reached the limit!',
							'WARNING',
						),
					],
					ephemeral: true,
				});
			}

			const registeredPlayers: any =
				interaction.message.embeds[0].fields?.find((r) =>
					r.name.includes('Registered players'),
				);

			let newPlayersList: string = ' ';
			if (registeredPlayers.value.length === 0) {
				newPlayersList = `${interaction.user.tag}\n`;
			} else {
				if (
					registeredPlayers.value
						.split('>>> ')[1]
						.split('\n')
						.indexOf(interaction.user.tag) !== -1
				) {
					return await interaction.reply({
						embeds: [
							infoMessageEmbed('You are already registered!', 'WARNING'),
						],
						ephemeral: true,
					});
				} else {
					const oldPlayersList: [string] = registeredPlayers.value
						.split('>>> ')[1]
						.split('\n');

					oldPlayersList.push(interaction.user.tag);

					newPlayersList = oldPlayersList.join('\n');
				}
			}

			/* assigning updated player list back to the orignal embed field AND update player count */
			interaction.message.embeds[0].fields?.find((r) => {
				if (r.name.includes('Registered players')) {
					let numRegisteredPlayers: number = parseInt(
						r.name.split(' ')[2].split('/')[0],
					);
					const maxNumPlayersEmbedValue = r.name
						.split(' ')[2]
						.split('/')[1];

					numRegisteredPlayers += 1;

					r.name = `Registered players ${numRegisteredPlayers}/${maxNumPlayersEmbedValue}`;
					r.value = `>>> ${newPlayersList}`;
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
			console.log(err);
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in buttonFunctions/teamEvent/registerTeamPlayer.ts \n Actual error: ${err} \n \n`,
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

export default registerTeamPlayer;
