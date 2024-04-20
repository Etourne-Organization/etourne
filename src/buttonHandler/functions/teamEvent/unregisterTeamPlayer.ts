import { Client, ButtonInteraction, MessageEmbed } from 'discord.js';

import logFile from '../../../globalUtils/logFile';
import { ButtonFunction } from '../../Button';
import infoMessageEmbed, { types } from '../../../globalUtils/infoMessageEmbed';
import { removePlayer } from '../../../supabase/supabaseFunctions/teamPlayers';
import { checkTeamExists } from '../../../supabase/supabaseFunctions/teams';
import errorMessageTemplate from '../../../globalUtils/errorMessageTemplate';
import botConfig from '../../../botConfig';

const unregisterTeamPlayer: ButtonFunction = {
	customId: 'unregisterTeamPlayer',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			await interaction.deferUpdate();

			const footer = interaction.message.embeds[0].footer?.text;
			const teamId: string | any =
				interaction.message.embeds[0].footer?.text.split(' ')[2];

			if (!(await checkTeamExists({ teamId: parseInt(teamId) }))) {
				return interaction.followUp({
					embeds: [
						infoMessageEmbed({
							title: ':warning: The team does not exist anymore, maybe it was deleted?',
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
				return await interaction.followUp({
					embeds: [
						infoMessageEmbed({
							title: ':warning: The registration list is empty!',
							type: types.ERROR,
						}),
					],
					ephemeral: true,
				});
			} else {
				const oldPlayersList: [string] = registeredPlayers.value
					.split('>>> ')[1]
					.split('\n');

				if (oldPlayersList.indexOf(interaction.user.username) === -1) {
					return await interaction.followUp({
						embeds: [
							infoMessageEmbed({
								title: ':warning: You are not registered!',
								type: types.ERROR,
							}),
						],
						ephemeral: true,
					});
				}

				const index = oldPlayersList.indexOf(interaction.user.username);
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
						title: ':white_check_mark: Unregistered successfully!',
						type: types.SUCCESS,
					}),
				],
				ephemeral: true,
			});
		} catch (err) {
			await interaction.followUp({
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
				folder: 'buttonHandler/functions',
				file: 'teamEvent/unregisterTeamPlayer',
			});
		}
	},
};

export default unregisterTeamPlayer;
