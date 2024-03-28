import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import logFile from '../../globalUtils/logFile';
import { Command } from '../Command';
import commandIds from '../../commandIds';
import infoMessageEmbed, { types } from '../../globalUtils/infoMessageEmbed';
import botConfig from '../../botConfig';

const getStarted: Command = {
	name: 'getstarted',
	description: 'Get started with using Etourne bot',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			const embed = new MessageEmbed()
				.setColor(botConfig.color.default)
				.setThumbnail(`${client.user?.displayAvatarURL()}`)
				.setTitle('')
				.setDescription(
					`# :rocket: Get started\nThank you for choosing Etourne.\n\nIn summary, Etourne aims to make the process of creating and managing events and tournaments much easier with simple commands and buttons (as well as [web app](https://etourne.com) - currently in beta).\n\n## Etourne has 3 roles:\n• __Player__: Default role of every user in the sever to register for any event and create teams.\n• __Manager__: Event manager with the permission to create and manage events, teams and players.\n• __Admin__: Admin with all the privileges of \`manager\` and \`player\` with additional permisson which is </setuserrole:${commandIds.SET_USER_ROLE}>. User who adds the bot gets this role by default.\n\n## To get started:\n• Use </createevent:${commandIds.CREATE_EVENT}> to start creating events.\n• Use </createteamevent:${commandIds.CREATE_TEAM_EVENT}> to start creating team events.\n• Use </help:${commandIds.HELP}> to find out other commands you can use.\n\n**Note:** Double check whether your Discord server is registered in Etourne database by using </registerserver:${commandIds.REGISTER_SERVER}> \n \n## To share any feedback or report bugs:\nUse </feedback:${commandIds.FEEDBACK}> \n \n## To get support:\nUse </requestsupport:${commandIds.REQUEST_SUPPORT}>`,
				)
				.setFooter({ text: `Requested by: ${interaction.user.tag}` })
				.setTimestamp();

			await interaction.reply({
				embeds: [embed],
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
				file: 'getStarted',
			});
		}
	},
};

export default getStarted;
