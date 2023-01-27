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

			const playersSplitted = registeredPlayers.value
				.split(' ')[2]
				.split('\n');

			// console.log(interaction.message.embeds[0].fields);
			// console.log(interaction.message.embeds[0]);
			console.log(registeredPlayers);
			console.log(playersSplitted);

			const editedEmbed = new MessageEmbed()
				.setColor('#3a9ce2')
				.setTitle(interaction.message.embeds[0].title || 'Undefined')
				.setDescription(
					interaction.message.embeds[0].description || 'Undefined',
				)
				.addFields();

			interaction.reply({
				content: 'hello',
			});
		} catch (err) {
			console.log(err);
		}
	},
};

export default testRegister;
