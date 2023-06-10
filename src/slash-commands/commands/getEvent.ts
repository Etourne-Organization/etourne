import fs from 'fs';

import {
	BaseCommandInteraction,
	Client,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
} from 'discord.js';
import dayjs from 'dayjs';

import {
	getAllColumnValueById,
	setColumnValue,
} from '../../supabase/supabaseFunctions/events';
import { Command } from '../CommandStructure';
import infoMessageEmbed from '../../globalUtils/infoMessageEmbed';
import {
	getUserRole,
	setUserRole as setUserRoleSupabase,
} from '../../supabase/supabaseFunctions/users';

const getEvent: Command = {
	name: 'getevent',
	description: 'Get event by event ID',
	type: 'CHAT_INPUT',
	options: [
		{
			name: 'eventid',
			description: 'Enter event ID',
			type: 'NUMBER',
			required: true,
		},
	],
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			const eventId: number | any = interaction.options.get('eventid');

			const userRoleDB: any = await getUserRole({
				discordUserId: interaction.user.id,
				discordServerId: interaction.guild!.id,
			});

			if (userRoleDB.length === 0 || userRoleDB[0]['roleId'] !== 3) {
				return await interaction.reply({
					embeds: [
						infoMessageEmbed(
							':warning: You are not allowed to run this command!',
							'WARNING',
						),
					],
					ephemeral: true,
				});
			}

			const eventInfo: any = await getAllColumnValueById({
				id: eventId.value,
			});

			if (eventInfo.length > 0) {
				const fetchedMessage = await interaction.channel?.messages
					.fetch(eventInfo[0].messageId)
					.catch((err) => {});

				if (fetchedMessage) {
					const embed = new MessageEmbed()
						.setColor('#D83C3E')
						.setTitle(':x: Event cannot be shared')
						.setDescription(
							`The event embed has already been shared in <#${
								fetchedMessage.channelId
							}> (message link: https://discord.com/channels/${
								interaction.guild!.id
							}/${fetchedMessage.channelId}/${
								fetchedMessage.id
							})\nTo reshare the event embed in a new channel, delete the existing event embed.`,
						)
						.setTimestamp();

					return await interaction.reply({
						embeds: [embed],
						ephemeral: true,
					});
				} else {
					const eventEmbed = new MessageEmbed()
						.setColor('#3a9ce2')
						.setTitle(eventInfo[0].eventName)
						.setDescription(
							`**----------------------------------------** \n **Event description:** \n \n >>> ${eventInfo[0].description}  \n \n`,
						)
						.addFields([
							{
								name: 'Event date & time',
								value: `<t:${dayjs(
									eventInfo[0]['dateTime'],
								).unix()}:F>`,
								inline: true,
							},
							{
								name: 'Game name',
								value: eventInfo[0].gameName,
								inline: true,
							},
							{ name: 'Hosted by', value: eventInfo[0].eventHost },
							{
								name: `Registered players 0/${
									eventInfo[0].maxNumPlayers
										? eventInfo[0].maxNumPlayers
										: 'unlimited'
								}`,
								value: ` `,
							},
						])
						.setFooter({
							text: `Event ID: ${eventId.value}`,
						});

					const reply = await interaction.channel?.send({
						embeds: [eventEmbed],
					});

					// await setColumnValue({
					// 	data: [
					// 		{
					// 			id: eventId,
					// 			key: 'messageId',
					// 			value: reply!.id,
					// 		},
					// 	],
					// });

					return await interaction.reply({
						embeds: [
							infoMessageEmbed(
								':white_check_mark: Event reshared Successfully',
								'SUCCESS',
							),
						],
						ephemeral: true,
					});
				}
			} else {
				return await interaction.reply({
					embeds: [infoMessageEmbed(':x: Event cannot be found', 'ERROR')],
					ephemeral: true,
				});
			}
		} catch (err) {
			console.log(err);

			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in slashcommands/getEvent.ts \n Actual error: ${err} \n \n`,
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

export default getEvent;
