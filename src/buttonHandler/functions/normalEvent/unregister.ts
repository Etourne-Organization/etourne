import { Client, ButtonInteraction, MessageEmbed } from 'discord.js';

import logFile from '../../../globalUtils/logFile';
import { ButtonFunction } from '../../Button';
import infoMessageEmbed, { types } from '../../../globalUtils/infoMessageEmbed';
import { removePlayer } from '../../../supabase/supabaseFunctions/singlePlayers';
import errorMessageTemplate, {
	MessageType,
} from '../../../globalUtils/errorMessageTemplate';
import botConfig from '../../../botConfig';

const unregister: ButtonFunction = {
	customId: 'normalEventUnregister',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			await interaction.deferUpdate();

			const eventId: string | any =
				interaction.message.embeds[0].footer?.text.split(': ')[1];

			const registeredPlayers:
				| {
						name: string;
						value: string;
						inline: boolean;
				  }
				| any = interaction.message.embeds[0].fields?.find((r) =>
				r.name.includes('Registered players'),
			);

			let newPlayersList: string = ' ';
			if (registeredPlayers.value.length === 0) {
				return await interaction.editReply({
					embeds: [
						infoMessageEmbed({
							title: ':warning: The registration list is empty!',
							type: types.ERROR,
						}),
					],
				});
			} else {
				const oldPlayersList: [string] = registeredPlayers.value
					.split('>>> ')[1]
					.split('\n');

				if (oldPlayersList.indexOf(interaction.user.tag) === -1) {
					return await interaction.editReply({
						embeds: [
							infoMessageEmbed({
								title: 'You are not registered!',
								type: types.ERROR,
							}),
						],
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

			const editedEmbed = new MessageEmbed()
				.setColor(botConfig.color.default)
				.setTitle(interaction.message.embeds[0].title || 'Undefined')
				.setDescription(
					interaction.message.embeds[0].description || 'Undefined',
				)
				.addFields(interaction.message.embeds[0].fields || [])
				.setFooter({ text: `Event ID: ${eventId}` });

			await removePlayer({
				discordUserId: interaction.user.id,
				eventId: parseInt(eventId),
			});

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
				file: 'normalEvent/unregister',
			});
		}
	},
};

export default unregister;
