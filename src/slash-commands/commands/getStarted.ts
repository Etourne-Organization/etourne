import fs from 'fs';

import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import { Command } from '../CommandStructure';
import testCommandIDs from '../../TEST_COMMAND_IDS/commandIDs.json';
import originalCommandIDs from '../../ORIGINAL_COMMAND_IDS/commandIDs.json';

const getStarted: Command = {
	name: 'getstarted',
	description: 'Helps any user to get started with Etourne',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			const embed = new MessageEmbed()
				.setColor('#3a9ce2')
				.setThumbnail(`${client.user?.displayAvatarURL()}`)
				.setTitle('Get started')
				.setDescription(
					`Thank you for choosing Etourne. \n In summary, Etourne aims to create and manage events and tournaments much easier. \n To get started, use ${
						process.env.BOT_IDS === 'TEST_BOT_IDS'
							? `</createevent:${testCommandIDs.CREATE_EVENT}>`
							: `</createvent:${originalCommandIDs.CREATE_EVENT}>`
					} to start creating events. \n Use ${
						process.env.BOT_IDS === 'TEST_BOT_IDS'
							? `</createteamevent:${testCommandIDs.CREATE_TEAM_EVENT}>`
							: `</createteamevent:${originalCommandIDs.CREATE_TEAM_EVENT}>`
					} to start creating team events.`,
				)
				.setFooter({ text: `Requested by: ${interaction.user.tag}` })
				.setTimestamp();

			await interaction.reply({
				embeds: [embed],
			});
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in slashcommands/getStarted.ts \n Actual error: ${err} \n \n`,
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

export default getStarted;
