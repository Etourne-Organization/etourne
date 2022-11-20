import fs from 'fs';

import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import { Command } from '../CommandStructure';
import testCommandIDs from '../../TEST_BOT_IDS/commandIDs.json';
import originalCommandIDs from '../../ORIGINAL_BOT_IDS/commandIDs.json';

const help: Command = {
	name: 'help',
	description: 'Help embed to see all the commands',
	type: 'CHAT_INPUT',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			const member: string = interaction.user.tag;

			const helpEmbed = new MessageEmbed()
				.setColor('#3a9ce2')
				.setTitle(`${client.user?.username}`)
				.setDescription('Here is the list of commands you can use')
				.setThumbnail(`${client.user?.displayAvatarURL()}`)
				.addFields(
					{
						name: ':calendar_spiral:  Create event',
						value:
							process.env.BOT_IDS === 'TEST_BOT_IDS'
								? `</createevent:${testCommandIDs.CREATE_EVENT}>`
								: `</verify:${originalCommandIDs.CREATE_EVENT}>`,
					},
					{
						name: ':information_source:  Bot Info',
						value:
							process.env.BOT_IDS === 'TEST_BOT_IDS'
								? `</botinfo:${testCommandIDs.BOT_INFO}>`
								: `</botinfo:${originalCommandIDs.BOT_INFO}>`,
					},

					// { name: '\u200B', value: '\u200B' },
				)
				.setTimestamp()
				.setFooter({ text: `Requested by: ${member}` });

			await interaction.reply({
				embeds: [helpEmbed],
			});
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in slashcommands/help.ts \n Actual error: ${err} \n \n`,
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

export default help;
