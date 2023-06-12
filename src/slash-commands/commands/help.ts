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
						value: `Get more information about the bot: ${
							process.env.BOT_IDS === 'TEST_BOT_IDS'
								? `</botinfo:${testCommandIDs.BOT_INFO}>`
								: `</botinfo:${originalCommandIDs.BOT_INFO}>`
						}`,
					},
					{
						name: ':rocket:  Get started',
						value: `Get started using Etourne: ${
							process.env.BOT_IDS === 'TEST_BOT_IDS'
								? `</getstarted:${testCommandIDs.GET_STARTED}>`
								: `</getstarted:${originalCommandIDs.GET_STARTED}>`
						}`,
					},
					{
						name: ':calendar_spiral:  Create event',
						value: `Create event (no-team): ${
							process.env.BOT_IDS === 'TEST_BOT_IDS'
								? `</createevent:${testCommandIDs.CREATE_EVENT}>`
								: `</createevent:${originalCommandIDs.CREATE_EVENT}>`
						}`,
					},
					{
						name: ':calendar_spiral:  Create team event',
						value: `Create team event: ${
							process.env.BOT_IDS === 'TEST_BOT_IDS'
								? `</createteamevent:${testCommandIDs.CREATE_TEAM_EVENT}>`
								: `</createteamevent:${originalCommandIDs.CREATE_TEAM_EVENT}>`
						}`,
					},
					{
						name: ':mag_right:  Get event',
						value: `Get event from database: ${
							process.env.BOT_IDS === 'TEST_BOT_IDS'
								? `</getevent:${testCommandIDs.GET_EVENT}>`
								: `</getevent:${originalCommandIDs.GET_EVENT}>`
						}`,
					},
					{
						name: ':notepad_spiral:  List server events',
						value: `List all the events being hosted in the server: ${
							process.env.BOT_IDS === 'TEST_BOT_IDS'
								? `</listserverevents:${testCommandIDs.LIST_SERVER_EVENTS}>`
								: `</listserverevents:${originalCommandIDs.LIST_SERVER_EVENTS}>`
						}`,
					},
					{
						name: ':pencil2:  Set user role',
						value: `Set role of a user: ${
							process.env.BOT_IDS === 'TEST_BOT_IDS'
								? `</setuserrole:${testCommandIDs.SET_USER_ROLE}>`
								: `</setuserrole:${originalCommandIDs.SET_USER_ROLE}>`
						}`,
					},
					{
						name: ':thought_balloon:  Feedback',
						value: `Share feedback and ideas or raise issues: ${
							process.env.BOT_IDS === 'TEST_BOT_IDS'
								? `</feedback:${testCommandIDs.FEEDBACK}>`
								: `</feedback:${originalCommandIDs.FEEDBACK}>`
						}`,
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
