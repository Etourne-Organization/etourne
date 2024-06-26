import { Client, ButtonInteraction, MessageEmbed } from 'discord.js';

import logFile from '../../../globalUtils/logFile';
import { ButtonFunction } from '../../Button';
import infoMessageEmbed, { types } from '../../../globalUtils/infoMessageEmbed';
import {
	addPlayer,
	getNumOfTeamPlayers,
} from '../../../supabase/supabaseFunctions/teamPlayers';
import { getColumnValueById } from '../../../supabase/supabaseFunctions/events';
import { checkTeamExists } from '../../../supabase/supabaseFunctions/teams';
import errorMessageTemplate, {
	MessageType,
} from '../../../globalUtils/errorMessageTemplate';
import botConfig from '../../../botConfig';

const registerTeamPlayer: ButtonFunction = {
	customId: 'registerTeamPlayer',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			await interaction.deferUpdate();

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
				return interaction.followUp({
					embeds: [
						infoMessageEmbed({
							title: 'The team does not exist anymore, maybe it was deleted?',
							type: types.ERROR,
						}),
					],
					ephemeral: true,
				});
			}

			if (
				maxNumTeamPlayers.length > 0 &&
				(await getNumOfTeamPlayers({ teamId: teamId })) ===
					maxNumTeamPlayers[0]['maxNumTeamPlayers']
			) {
				return await interaction.followUp({
					embeds: [
						infoMessageEmbed({
							title: 'Number of players has reached the limit!',
							type: types.ERROR,
						}),
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
				newPlayersList = `${interaction.user.username}\n`;
			} else {
				if (
					registeredPlayers.value
						.split('>>> ')[1]
						.split('\n')
						.indexOf(interaction.user.username) !== -1
				) {
					return await interaction.followUp({
						embeds: [
							infoMessageEmbed({
								title: 'You are already registered!',
								type: types.ERROR,
							}),
						],
						ephemeral: true,
					});
				} else {
					const oldPlayersList: [string] = registeredPlayers.value
						.split('>>> ')[1]
						.split('\n');

					oldPlayersList.push(interaction.user.username);

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
				username: interaction.user.username,
				discordUserId: interaction.user.id,
				teamId: parseInt(teamId),
				discordServerId: interaction.guild?.id!,
			});

			const editedEmbed = new MessageEmbed()
				.setColor(botConfig.color.default)
				.setTitle(interaction.message.embeds[0].title || 'Undefined')
				.setDescription(
					interaction.message.embeds[0].description || 'Undefined',
				)
				.addFields(interaction.message.embeds[0].fields || [])
				.setFooter({ text: `${footer}` });

			await interaction.editReply({ embeds: [editedEmbed] });

			return await interaction.followUp({
				embeds: [
					infoMessageEmbed({
						title: ':white_check_mark: Registered successfully!',
						type: types.SUCCESS,
					}),
				],
				ephemeral: true,
			});
		} catch (err) {
			await interaction.followUp({
				embeds: [
					infoMessageEmbed({
						title: errorMessageTemplate({
							messageType: MessageType.SHORT,
						}).title,
						description: errorMessageTemplate({
							messageType: MessageType.SHORT,
						}).description,
						type: types.ERROR,
					}),
				],
				ephemeral: true,
			});

			logFile({
				error: err,
				folder: 'buttonHandler/functions',
				file: 'teamEvent/registerTeamPlayer',
			});
		}
	},
};

export default registerTeamPlayer;
