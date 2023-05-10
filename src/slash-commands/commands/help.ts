import fs from 'fs';

import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import { Command } from '../CommandStructure';
import testCommandIDs from '../../TEST_COMMAND_IDS/commandIDs.json';
import originalCommandIDs from '../../ORIGINAL_COMMAND_IDS/commandIDs.json';

const help: Command = {
	name: 'help',
	description: 'Help embed to see all the commands',
	type: 'CHAT_INPUT',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			const member: string = interaction.user.tag;

			const helpEmbed = new MessageEmbed()
				.setColor('#3a9ce2')
				.setTitle(`:question: Help`)
				.setDescription('Here is the list of commands you can use')
				.setThumbnail(`${client.user?.displayAvatarURL()}`)
				.addFields(
					{
						name: ':information_source:  Bot Info',
						value:
							process.env.BOT_IDS === 'TEST_BOT_IDS'
								? `</botinfo:${testCommandIDs.BOT_INFO}>`
								: `</botinfo:${originalCommandIDs.BOT_INFO}>`,
					},
					{
						name: ':rocket:  Get started',
						value:
							process.env.BOT_IDS === 'TEST_BOT_IDS'
								? `</getstarted:${testCommandIDs.GET_STARTED}>`
								: `</getstarted:${originalCommandIDs.GET_STARTED}>`,
					},
					{
						name: ':calendar_spiral:  Create event',
						value:
							process.env.BOT_IDS === 'TEST_BOT_IDS'
								? `</createevent:${testCommandIDs.CREATE_EVENT}>`
								: `</createvent:${originalCommandIDs.CREATE_EVENT}>`,
					},
					{
						name: ':calendar_spiral:  Create team event',
						value:
							process.env.BOT_IDS === 'TEST_BOT_IDS'
								? `</createteamevent:${testCommandIDs.CREATE_TEAM_EVENT}>`
								: `</createteamevent:${originalCommandIDs.CREATE_TEAM_EVENT}>`,
					},
					{
						name: ':pencil2:  Set user role',
						value:
							process.env.BOT_IDS === 'TEST_BOT_IDS'
								? `</setuserrole:${testCommandIDs.SET_USER_ROLE}>`
								: `</setuserrole:${originalCommandIDs.SET_USER_ROLE}>`,
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
