import fs from 'fs';

import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import { Command } from '../CommandStructure';

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
					// { name: '\u200B', value: '\u200B' },
					{ name: 'Bot Tag', value: `${client.user!.tag}` },
					{ name: 'Bot version', value: `1.0.0-beta` },
					{
						name: 'Bot command prefix',
						value: `\`${process.env.PREFIX}\``,
					},

					{
						name: 'Server Count',
						value: `${client.guilds.cache.size}`,
					},
					// {
					// 	name: 'Currently being hosted on',
					// 	value: `https://crvt.co/b`,
					// },
					{
						name: 'Status of the app/bot',
						value: `Work in progress`,
					},
					{
						name: 'Time since last restart',
						value: `${process.uptime().toFixed(2)}s`,
					},
				)
				.setFooter({ text: 'Creator: mz10ah#0054' })
				.setTimestamp();

			await interaction.reply({
				embeds: [botInfoEmbed],
			});
		} catch (err) {
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
