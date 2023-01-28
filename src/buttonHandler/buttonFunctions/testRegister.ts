import fs from 'fs';

import { Client, ButtonInteraction, MessageEmbed } from 'discord.js';

import { ButtonFunction } from '../ButtonStructure';

const testRegister: ButtonFunction = {
	customId: 'testregister',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
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

			// will be helpful for checking if the member is already registered
			console.log(tempSplit);

			let playersSplitted =
				tempSplit.length <= 1 && tempSplit[0].length < 1
					? []
					: tempSplit[1].includes('\n')
					? tempSplit[1].split('\n')
					: [tempSplit[1]];

			// console.log(interaction.message.embeds[0].fields);
			// console.log(interaction.message.embeds[0]);
			// console.log(registeredPlayers);
			console.log('before', playersSplitted);

			if (playersSplitted.length < 1) {
				console.log(1);
				playersSplitted.push('>>> ' + interaction.user.tag + '\n');
				tempSplit = playersSplitted;
			} else {
				console.log(2);
				playersSplitted.push(`${interaction.user.tag}\n`);
				tempSplit[1] = playersSplitted.join('');
			}

			console.log('after', playersSplitted);
			console.log('---');

			/* assigning updated player list back to the orignal embed field */
			interaction.message.embeds[0].fields?.find((r) => {
				if (r.name === 'Registered players') {
					r.value = playersSplitted;
				}
			});

			const editedEmbed = new MessageEmbed()
				.setColor('#3a9ce2')
				.setTitle(interaction.message.embeds[0].title || 'Undefined')
				.setDescription(
					interaction.message.embeds[0].description || 'Undefined',
				)
				.addFields(interaction.message.embeds[0].fields || []);

			await interaction.update({ embeds: [editedEmbed] });

			// await interaction.reply({
			// 	content: 'hello',
			// });
		} catch (err) {
			console.log(err);
		}
	},
};

export default testRegister;
