import fs from 'fs';

import { Client, ButtonInteraction, MessageEmbed } from 'discord.js';

import { ButtonFunction } from '../../ButtonStructure';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';
import {
	addPlayer,
	getNumOfPlayers,
} from '../../../supabase/supabaseFunctions/singlePlayers';
import { getColumnValueById } from '../../../supabase/supabaseFunctions/events';

const register: ButtonFunction = {
	customId: 'normalEventRegister',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			const eventId: string | any =
				interaction.message.embeds[0].footer?.text.split(': ')[1];

			const maxNumPlayers: any = await getColumnValueById({
				id: eventId,
				columnName: 'maxNumPlayers',
			});

			if (
				maxNumPlayers.length > 0 &&
				(await getNumOfPlayers({ eventId: eventId })) ===
					maxNumPlayers[0]['maxNumPlayers']
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
				eventId: parseInt(eventId),
				discordServerId: interaction.guild?.id!,
			});

			const editedEmbed = new MessageEmbed()
				.setColor('#3a9ce2')
				.setTitle(interaction.message.embeds[0].title || 'Undefined')
				.setDescription(
					interaction.message.embeds[0].description || 'Undefined',
				)
				.addFields(interaction.message.embeds[0].fields || [])
				.setFooter({ text: `Event ID: ${eventId}` });

			await interaction.update({ embeds: [editedEmbed] });
		} catch (err) {
			try {
				console.log(err);
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in buttonFunctions/normalEvent/register.ts \n Actual error: ${err} \n \n`,
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

export default register;
