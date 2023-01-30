import fs from 'fs';

import { Client, ButtonInteraction, MessageEmbed } from 'discord.js';

import { ButtonFunction } from '../../ButtonStructure';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';

const unregister: ButtonFunction = {
	customId: 'normalEventUnregister',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			let FOUND: boolean = false;
			const registeredPlayers:
				| {
						name: string;
						value: string;
						inline: boolean;
				  }
				| any = interaction.message.embeds[0].fields?.find(
				(r) => r.name === 'Registered players',
			);

			let tempSplit = registeredPlayers.value.split(' ');

			let playersSplitted =
				tempSplit.length <= 1 && tempSplit[0].length < 1
					? ['']
					: tempSplit[1].includes('\n')
					? tempSplit[1].split('\n')
					: [tempSplit[1]];

			await playersSplitted.forEach(async (p: string, index: number) => {
				if (p === interaction.user.tag) {
					playersSplitted.splice(index, 1);

					console.log(playersSplitted);

					/* assigning updated player list back to the orignal embed field */
					interaction.message.embeds[0].fields?.find((r) => {
						if (r.name === 'Registered players') {
							r.value =
								playersSplitted.length >= 1
									? '>>> ' + playersSplitted.join('\n')
									: ' ';
						}
					});

					const editedEmbed = new MessageEmbed()
						.setColor('#3a9ce2')
						.setTitle(interaction.message.embeds[0].title || 'Undefined')
						.setDescription(
							interaction.message.embeds[0].description || 'Undefined',
						)
						.addFields(interaction.message.embeds[0].fields || []);

					FOUND = true;
					await interaction.update({ embeds: [editedEmbed] });
				}
			});

			if (!FOUND) {
				return await interaction.reply({
					embeds: [infoMessageEmbed('You are not registered!', 'WARNING')],
					ephemeral: true,
				});
			} else {
			}
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
