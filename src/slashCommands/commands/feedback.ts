import fs from 'fs';

import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import { Command } from '../Command';
import infoMessageEmbed from '../../globalUtils/infoMessageEmbed';

const feedback: Command = {
	name: 'feedback',
	description: 'Send feedback',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			const embed = new MessageEmbed()
				.setColor('#3A9CE2')
				.setTitle(':thought_balloon: Feedback')
				.setFields([
					{
						name: ':plunger: Report bug',
						value: 'https://etourne.canny.io/bugs',
					},
					{
						name: ':pencil: Share feedback or new ideas',
						value: 'https://etourne.canny.io/feature-requests',
					},
				])
				.setFooter({ text: 'Etourne' })
				.setTimestamp();

			return await interaction.reply({
				embeds: [embed],
			});
		} catch (err) {
			await interaction.reply({
				embeds: [infoMessageEmbed(':x: There has been an error', 'ERROR')],
				ephemeral: true,
			});

			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in slashcommands/feedback.ts \n Actual error: ${err} \n \n`,
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

export default feedback;
