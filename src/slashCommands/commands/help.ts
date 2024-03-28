import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import logFile from '../../globalUtils/logFile';
import { Command } from '../Command';
import infoMessageEmbed, { types } from '../../globalUtils/infoMessageEmbed';
import commandIds from '../../commandIds';

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
						value: `Get more information about the bot: </botinfo:${commandIds.BOT_INFO}>`,
					},
					{
						name: ':pencil:  Register Server',
						value: `Register your Discord server in Etourne database: </registerserver:${commandIds.REGISTER_SERVER}>`,
					},
					{
						name: ':pencil:  Register Admin',
						value: `Register user who added the bot as Admin in Etourne database: </registeradmin:${commandIds.REGISTER_ADMIN}>`,
					},
					{
						name: ':rocket:  Get started',
						value: `Get started with using Etourne: </getstarted:${commandIds.GET_STARTED}>`,
					},
					{
						name: ':calendar_spiral:  Create event',
						value: `Create event (no-team): </createevent:${commandIds.CREATE_EVENT}>`,
					},
					{
						name: ':calendar_spiral:  Create team event',
						value: `Create team event: </createteamevent:${commandIds.CREATE_TEAM_EVENT}>`,
					},
					{
						name: ':mag_right:  Get event',
						value: `Get event from database: </getevent:${commandIds.GET_EVENT}>`,
					},
					{
						name: ':notepad_spiral:  List server events',
						value: `List all the events being hosted in the server: </listserverevents:${commandIds.LIST_SERVER_EVENTS}>`,
					},
					{
						name: ':pencil2:  Set user role',
						value: `Set role of a user: </setuserrole:${commandIds.SET_USER_ROLE}>`,
					},
					{
						name: ':thought_balloon:  Feedback',
						value: `Share feedback and ideas or raise issues: </feedback:${commandIds.FEEDBACK}>`,
					},
					{
						name: ':tools:  Request Support',
						value: `Request for support whenever you are facing issues: </requestsupport:${commandIds.REQUEST_SUPPORT}>`,
					},
				)
				.setTimestamp()
				.setFooter({ text: `Requested by: ${member}` });

			await interaction.reply({
				embeds: [helpEmbed],
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
				file: 'help',
			});
		}
	},
};

export default help;
