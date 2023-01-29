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
			let playersSplitted =
				tempSplit.length <= 1 && tempSplit[0].length < 1
					? ''
					: tempSplit[1].includes('\n')
					? tempSplit[1].split('\n')
					: [tempSplit[1]];

			if (!Array.isArray(playersSplitted) && playersSplitted.length < 1) {
				playersSplitted = `${interaction.user.tag}\n`;
				tempSplit = playersSplitted;
			} else {
				tempSplit.push(`${interaction.user.tag}\n`);
				tempSplit.shift();
			}

			/* assigning updated player list back to the orignal embed field */
			interaction.message.embeds[0].fields?.find((r) => {
				if (r.name === 'Registered players') {
					r.value = Array.isArray(tempSplit)
						? '>>> ' + tempSplit.join('\n')
						: '>>> ' + tempSplit;
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
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in testRegister.ts \n Actual error: ${err} \n \n`,
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

export default testRegister;
