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

			const maxNumPlayer: any = await getColumnValueById({
				id: eventId,
				columnName: 'maxNumPlayer',
			});

			if (
				maxNumPlayer.length > 0 &&
				(await getNumOfPlayers({ eventId: eventId })) ===
					maxNumPlayer[0]['maxNumPlayer']
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

			const tempSplit: Array<string> = registeredPlayers.value.split(' ');

			// will be helpful for checking if the member is already registered
			const playersSplitted: Array<string> =
				tempSplit.length <= 1 && tempSplit[0].length < 1
					? ['']
					: tempSplit[1].includes('\n')
					? tempSplit[1].split('\n')
					: [tempSplit[1]];

			const playerIndex = playersSplitted.indexOf(interaction.user.tag);

			if (playerIndex === -1) {
				tempSplit.push(`${interaction.user.tag}\n`);
				tempSplit.shift();

				/* assigning updated player list back to the orignal embed field AND update player count */
				interaction.message.embeds[0].fields?.find((r) => {
					if (r.name.includes('Registered players')) {
						let numRegisteredPlayers: number = parseInt(
							r.name.split(' ')[2].split('/')[0],
						);
						const maxNumPlayer = r.name.split(' ')[2].split('/')[1];

						numRegisteredPlayers += 1;

						r.name = `Registered players ${numRegisteredPlayers}/${maxNumPlayer}`;
						r.value = Array.isArray(tempSplit)
							? '>>> ' + tempSplit.join('\n')
							: '>>> ' + tempSplit;
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
			} else {
				return interaction.reply({
					embeds: [
						infoMessageEmbed('You are already registered!', 'WARNING'),
					],
					ephemeral: true,
				});
			}
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
