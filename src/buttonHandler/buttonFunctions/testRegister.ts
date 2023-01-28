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

			const tempSplit = registeredPlayers.value.split(' ');

			// will be helpful for checking if the member is already registered
			let playersSplitted =
				tempSplit.length < 2
					? ''
					: tempSplit[1].includes('\n')
					? tempSplit[1].split('\n')
					: tempSplit[1];

			// console.log(interaction.message.embeds[0].fields);
			// console.log(interaction.message.embeds[0]);
			// console.log(registeredPlayers);
			console.log(tempSplit);
			console.log('before', playersSplitted);

			if (playersSplitted.length < 1) {
				playersSplitted = '>>> ' + interaction.user.tag;
			} else {
				playersSplitted += `>>> ${playersSplitted}\n${interaction.user.tag}`;
			}

			console.log('after', playersSplitted);

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

			// interaction.reply({
			// 	content: 'hello',
			// });
		} catch (err) {
			console.log(err);
		}
	},
};

export default testRegister;
