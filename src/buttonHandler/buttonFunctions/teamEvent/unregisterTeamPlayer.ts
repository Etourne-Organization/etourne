import fs from 'fs';

import { Client, ButtonInteraction, MessageEmbed } from 'discord.js';

import { ButtonFunction } from '../../ButtonStructure';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';
import { removePlayer } from '../../../supabase/supabaseFunctions/teamPlayers';
import { checkTeamExists } from '../../../supabase/supabaseFunctions/teams';

const unregisterTeamPlayer: ButtonFunction = {
	customId: 'unregisterTeamPlayer',
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
				interaction.message.embeds[0].fields?.find((r) =>
					r.name.includes('Registered players'),
				);

			let newPlayersList: string = ' ';
			if (registeredPlayers.value.length === 0) {
				return await interaction.reply({
					embeds: [
						infoMessageEmbed(
							'The registration list is empty!',
							'WARNING',
						),
					],
					ephemeral: true,
				});
			} else {
				const oldPlayersList: [string] = registeredPlayers.value
					.split('>>> ')[1]
					.split('\n');

				if (oldPlayersList.indexOf(interaction.user.tag) === -1) {
					return await interaction.reply({
						embeds: [
							infoMessageEmbed('You are not registered!', 'WARNING'),
						],
						ephemeral: true,
					});
				}

				const index = oldPlayersList.indexOf(interaction.user.tag);
				oldPlayersList.splice(index, 1);

				newPlayersList = oldPlayersList.join('\n');
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

					numRegisteredPlayers -= 1;

					r.name = `Registered players ${numRegisteredPlayers}/${maxNumPlayersEmbedValue}`;
					r.value = `${
						newPlayersList.length > 0 ? '>>>' : ' '
					} ${newPlayersList}`;
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

			return await interaction.update({ embeds: [editedEmbed] });
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in buttonFunctions/teamEvent/unregisterTeamPlayer.ts \n Actual error: ${err} \n \n`,
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

export default unregisterTeamPlayer;
