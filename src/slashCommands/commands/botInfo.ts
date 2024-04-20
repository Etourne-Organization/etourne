import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import logFile from '../../globalUtils/logFile';
import { Command } from '../Command';
import formatProcessUptime from '../utilities/formatProcessUptime';
import infoMessageEmbed, { types } from '../../globalUtils/infoMessageEmbed';
import botConfig from '../../botConfig';

const botInfo: Command = {
	name: 'botinfo',
	description: 'Information about the bot',
	type: 'CHAT_INPUT',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			const botInfoEmbed = new MessageEmbed()
				.setColor(botConfig.color.default)
				.setThumbnail(client.user!.displayAvatarURL())
				.setAuthor({
					name: `${client.user!.username}`,
					iconURL: `${client.user!.displayAvatarURL()}`,
				})
				.addFields(
					{ name: 'Bot Tag', value: `${client.user!.username}` },
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
				embeds: [
					infoMessageEmbed({
						title: ':x: There has been an error',
						type: types.ERROR,
					}),
				],
				ephemeral: true,
			});

			logFile({
				error: err,
				folder: 'slashCommands/commands',
				file: 'botInfo',
			});
		}
	},
};

export default botInfo;
