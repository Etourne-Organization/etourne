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
				.setTitle(':rocket: Get started')
				.setDescription(
					`Thank you for choosing Etourne. \n \n In summary, Etourne aims to make the process of creating and managing events and tournaments much easier with simple commands and buttons. \n \n Etourne has 3 roles: \n • __Player__: Default role of every user in the sever to register for any event and create teams. \n • __Manager__: Event manager with the permission to create and manage events, teams and players. \n • __Admin__: Admin with all the privileges of \`manager\` and \`player\` with additional permisson which is ${
						process.env.BOT_IDS === 'TEST_BOT_IDS'
							? `</setuserrole:${testCommandIDs.SET_USER_ROLE}>`
							: `</setuserrole:${originalCommandIDs.SET_USER_ROLE}>`
					}. User who adds the bot gets this role by default. \n \n To get started: \n • Use ${
						process.env.BOT_IDS === 'TEST_BOT_IDS'
							? `</createevent:${testCommandIDs.CREATE_EVENT}>`
							: `</createevent:${originalCommandIDs.CREATE_EVENT}>`
					} to start creating events. \n • Use ${
						process.env.BOT_IDS === 'TEST_BOT_IDS'
							? `</createteamevent:${testCommandIDs.CREATE_TEAM_EVENT}>`
							: `</createteamevent:${originalCommandIDs.CREATE_TEAM_EVENT}>`
					} to start creating team events. \n • Use ${
						process.env.BOT_IDS === 'TEST_BOT_IDS'
							? `</help:${testCommandIDs.HELP}>`
							: `</help:${originalCommandIDs.HELP}>`
					} to find out other commands you can use.\n \n  As always, feel free to reach out to mz10ah#0054 if you face any issues or have any queries.`,
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
