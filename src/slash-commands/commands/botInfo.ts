import fs from 'fs';

import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import { Command } from '../CommandStructure';
import formatProcessUptime from '../utilities/formatProcessUptime';
import infoMessageEmbed from '../../globalUtils/infoMessageEmbed';

const botInfo: Command = {
	name: 'botinfo',
	description: 'Information about the bot',
	type: 'CHAT_INPUT',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			const botInfoEmbed = new MessageEmbed()
				.setColor('#3A9CE2')
				.setThumbnail(client.user!.displayAvatarURL())
				.setAuthor({
					name: `${client.user!.username}`,
					iconURL: `${client.user!.displayAvatarURL()}`,
				})
				.addFields(
					{ name: 'Bot Tag', value: `${client.user!.tag}` },
					{ name: 'Bot version', value: `1.0.0` },
					{
						name: 'Bot command prefix',
						value: `\`${process.env.PREFIX}\``,
					},

					{
						name: 'Server Count',
						value: `${client.guilds.cache.size}`,
					},
				)
				.setFooter({ text: 'Creator: mz10ah#0054' })
				.setTimestamp();

			if (interaction.user.id === process.env.OWNER_ID) {
				botInfoEmbed.addFields([
					{
						name: 'Time elapsed since last restart',
						value: `${formatProcessUptime({
							uptime: process.uptime(),
						})}`,
					},
				]);
			}

			await interaction.reply({
				embeds: [botInfoEmbed],
			});
		} catch (err) {
			await interaction.reply({
				embeds: [infoMessageEmbed(':x: There has been an error', 'ERROR')],
			});

			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in slashcommands/botInfo.ts \n Actual error: ${err} \n \n`,
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

export default botInfo;
