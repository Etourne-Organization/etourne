import fs from 'fs';

import { Client, ButtonInteraction, MessageEmbed } from 'discord.js';

import { ButtonFunction } from '../../ButtonStructure';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';
import { removePlayer } from '../../../supabase/supabaseFunctions/singlePlayers';

const unregister: ButtonFunction = {
	customId: 'normalEventUnregister',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
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

			const editedEmbed = new MessageEmbed()
				.setColor('#3a9ce2')
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

			return await interaction.update({ embeds: [editedEmbed] });
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in buttonFunctions/normalEvent/unregister.ts \n Actual error: ${err} \n \n`,
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

export default unregister;
