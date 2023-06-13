import fs from 'fs';

import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import { Command } from '../CommandStructure';
import testCommandIDs from '../../TEST_COMMAND_IDS/commandIDs.json';
import originalCommandIDs from '../../ORIGINAL_COMMAND_IDS/commandIDs.json';
import infoMessageEmbed from '../../globalUtils/infoMessageEmbed';

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
							process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
								? `</botinfo:${testCommandIDs.BOT_INFO}>`
								: `</botinfo:${originalCommandIDs.BOT_INFO}>`
						}`,
					},
					{
						name: ':pencil:  Register Server',
						value: `Register your Discord server in Etourne database: ${
							process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
								? `</registerserver:${testCommandIDs.REGISTER_SERVER}>`
								: `</registerserver:${originalCommandIDs.REGISTER_SERVER}>`
						}`,
					},
					{
						name: ':rocket:  Get started',
						value: `Get started with using Etourne: ${
							process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
								? `</getstarted:${testCommandIDs.GET_STARTED}>`
								: `</getstarted:${originalCommandIDs.GET_STARTED}>`
						}`,
					},
					{
						name: ':calendar_spiral:  Create event',
						value: `Create event (no-team): ${
							process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
								? `</createevent:${testCommandIDs.CREATE_EVENT}>`
								: `</createevent:${originalCommandIDs.CREATE_EVENT}>`
						}`,
					},
					{
						name: ':calendar_spiral:  Create team event',
						value: `Create team event: ${
							process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
								? `</createteamevent:${testCommandIDs.CREATE_TEAM_EVENT}>`
								: `</createteamevent:${originalCommandIDs.CREATE_TEAM_EVENT}>`
						}`,
					},
					{
						name: ':mag_right:  Get event',
						value: `Get event from database: ${
							process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
								? `</getevent:${testCommandIDs.GET_EVENT}>`
								: `</getevent:${originalCommandIDs.GET_EVENT}>`
						}`,
					},
					{
						name: ':notepad_spiral:  List server events',
						value: `List all the events being hosted in the server: ${
							process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
								? `</listserverevents:${testCommandIDs.LIST_SERVER_EVENTS}>`
								: `</listserverevents:${originalCommandIDs.LIST_SERVER_EVENTS}>`
						}`,
					},
					{
						name: ':pencil2:  Set user role',
						value: `Set role of a user: ${
							process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
								? `</setuserrole:${testCommandIDs.SET_USER_ROLE}>`
								: `</setuserrole:${originalCommandIDs.SET_USER_ROLE}>`
						}`,
					},
					{
						name: ':thought_balloon:  Feedback',
						value: `Share feedback and ideas or raise issues: ${
							process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
								? `</feedback:${testCommandIDs.FEEDBACK}>`
								: `</feedback:${originalCommandIDs.FEEDBACK}>`
						}`,
					},
					{
						name: ':tools:  Request Support',
						value: `Request for support whenever you are facing issues: ${
							process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
								? `</requestsupport:${testCommandIDs.REQUEST_SUPPORT}>`
								: `</requestsupport:${originalCommandIDs.REQUEST_SUPPORT}>`
						}`,
					},
				)
				.setTimestamp()
				.setFooter({ text: `Requested by: ${member}` });

			await interaction.reply({
				embeds: [helpEmbed],
			});
		} catch (err) {
			await interaction.reply({
				embeds: [infoMessageEmbed(':x: There has been an error', 'ERROR')],
			});

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
