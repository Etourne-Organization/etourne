import fs from 'fs';

import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import { Command } from '../CommandStructure';
import testCommandIDs from '../../TEST_COMMAND_IDS/commandIDs.json';
import originalCommandIDs from '../../ORIGINAL_COMMAND_IDS/commandIDs.json';
import infoMessageEmbed from '../../globalUtils/infoMessageEmbed';

const getStarted: Command = {
	name: 'getstarted',
	description: 'Get started with using Etourne bot',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			const embed = new MessageEmbed()
				.setColor('#3a9ce2')
				.setThumbnail(`${client.user?.displayAvatarURL()}`)
				.setTitle('')
				.setDescription(
					`# :rocket: Get started\nThank you for choosing Etourne.\n\nIn summary, Etourne aims to make the process of creating and managing events and tournaments much easier with simple commands and buttons (as well as [web app](https://etourne.com) - currently in beta).\n\n## Etourne has 3 roles:\n• __Player__: Default role of every user in the sever to register for any event and create teams.\n• __Manager__: Event manager with the permission to create and manage events, teams and players.\n• __Admin__: Admin with all the privileges of \`manager\` and \`player\` with additional permisson which is ${
						process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
							? `</setuserrole:${testCommandIDs.SET_USER_ROLE}>`
							: `</setuserrole:${originalCommandIDs.SET_USER_ROLE}>`
					}. User who adds the bot gets this role by default.\n\n## To get started:\n• Use ${
						process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
							? `</createevent:${testCommandIDs.CREATE_EVENT}>`
							: `</createevent:${originalCommandIDs.CREATE_EVENT}>`
					} to start creating events.\n• Use ${
						process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
							? `</createteamevent:${testCommandIDs.CREATE_TEAM_EVENT}>`
							: `</createteamevent:${originalCommandIDs.CREATE_TEAM_EVENT}>`
					} to start creating team events.\n• Use ${
						process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
							? `</help:${testCommandIDs.HELP}>`
							: `</help:${originalCommandIDs.HELP}>`
					} to find out other commands you can use.\n\n**Note:** Double check whether your Discord server is registered in Etourne database by using ${
						process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
							? `</registerserver:${testCommandIDs.REGISTER_SERVER}>`
							: `</registerserver:${originalCommandIDs.REGISTER_SERVER}>`
					} \n \n## To share any feedback or report bugs:\nUse ${
						process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
							? `</feedback:${testCommandIDs.FEEDBACK}>`
							: `</feedback:${originalCommandIDs.FEEDBACK}>`
					} \n \n## To get support:\nUse ${
						process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
							? `</requestsupport:${testCommandIDs.REQUEST_SUPPORT}>`
							: `</requestsupport:${originalCommandIDs.REQUEST_SUPPORT}>`
					}`,
				)
				.setFooter({ text: `Requested by: ${interaction.user.tag}` })
				.setTimestamp();

			await interaction.reply({
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
