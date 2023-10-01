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
import { getUserRole } from '../../supabase/supabaseFunctions/users';
import { getAllPlayers } from '../../supabase/supabaseFunctions/singlePlayers';
import { checkServerExists } from '../../supabase/supabaseFunctions/servers';
import testCommandIDs from '../../TEST_COMMAND_IDS/commandIDs.json';
import originalCommandIDs from '../../ORIGINAL_COMMAND_IDS/commandIDs.json';

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
			if (
				!(await checkServerExists({
					discordServerId: interaction.guild!.id,
				}))
			) {
				const embed = new MessageEmbed()
					.setColor('#D83C3E')
					.setTitle(':x: Error: Server not registered!')
					.setDescription(
						`Use ${
							process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
								? `</registerserver:${testCommandIDs.REGISTER_SERVER}>`
								: `</registerserver:${originalCommandIDs.REGISTER_SERVER}>`
						} command to register your server in Etourne database.`,
					)
					.setFooter({
						text: 'Use /support to seek support if required.',
					})
					.setTimestamp();

				return await interaction.reply({
					embeds: [embed],
				});
			}

			const eventId: number | any = interaction.options.get('eventid');

			const userRoleDB: any = await getUserRole({
				discordUserId: interaction.user.id,
				discordServerId: interaction.guild!.id,
			});

			if (
				userRoleDB.length === 0 ||
				(userRoleDB[0]['roleId'] !== 3 && userRoleDB[0]['roleId'] !== 2)
			) {
				return await interaction.editReply({
					embeds: [
						infoMessageEmbed(
							':warning: You are not allowed to run this command!',
							'WARNING',
						),
					],
				});
			}

			await interaction.reply({
				content: 'Getting event ...',
				ephemeral: true,
			});

			const eventInfo: any = await getAllColumnValueById({
				id: eventId.value,
			});

			if (eventInfo.length > 0) {
				const fetchedChannel = await interaction.guild?.channels.fetch(
					eventInfo[0].channelId,
				);

				let fetchedMessage;

				if (fetchedChannel!.isText()) {
					fetchedMessage = await fetchedChannel.messages
						.fetch(eventInfo[0].messageId)
						.catch((err) => {});
				}

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

					return await interaction.editReply({
						content: ' ',
						embeds: [embed],
					});
				} else {
					const dbPlayers: [{ username: string; userId: string }?] =
						await getAllPlayers({ eventId: eventId.value });

					let players: string = '';

					if (dbPlayers.length > 0) {
						dbPlayers.forEach((p: any) => {
							players += `${p.username}\n`;
						});
					}

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
								name: `Registered players ${dbPlayers.length}/${
									eventInfo[0].maxNumPlayers
										? eventInfo[0].maxNumPlayers
										: 'unlimited'
								}`,
								value: players.length > 0 ? `>>> ${players}` : ' ',
							},
						])
						.setFooter({
							text: `Event ID: ${eventId.value}`,
						});

					/* buttons */
					const buttons = new MessageActionRow().addComponents(
						new MessageButton()
							.setCustomId('normalEventRegister')
							.setLabel('Register')
							.setStyle('PRIMARY'),
						new MessageButton()
							.setCustomId('normalEventUnregister')
							.setLabel('Unregister')
							.setStyle('DANGER'),
					);

					const managePlayerButtons = new MessageActionRow().addComponents(
						new MessageButton()
							.setCustomId('setMaxNumPlayers')
							.setLabel('Set max num of players')
							.setStyle('SECONDARY'),
						new MessageButton()
							.setCustomId('removePlayer')
							.setLabel('❌  Remove player')
							.setStyle('SECONDARY'),
					);

					const manageEventButtons = new MessageActionRow().addComponents(
						new MessageButton()
							.setCustomId('editEventInfo')
							.setLabel('⚙️  Edit event info')
							.setStyle('SECONDARY'),
						new MessageButton()
							.setCustomId('deleteEvent')
							.setLabel('🗑️  Delete event')
							.setStyle('DANGER'),
					);

					const editReply = await interaction.channel?.send({
						embeds: [eventEmbed],
						components: [
							buttons,
							managePlayerButtons,
							manageEventButtons,
						],
					});

					await setColumnValue({
						data: [
							{
								id: eventId.value,
								key: 'messageId',
								value: editReply!.id,
							},
							{
								id: eventId.value,
								key: 'channelId',
								value: interaction.channel!.id,
							},
						],
					});

					return await interaction.editReply({
						content: ' ',
						embeds: [
							infoMessageEmbed(
								':white_check_mark: Event reshared Successfully',
								'SUCCESS',
							),
						],
					});
				}
			} else {
				return await interaction.editReply({
					content: ' ',
					embeds: [infoMessageEmbed(':x: Event cannot be found', 'ERROR')],
				});
			}
		} catch (err) {
			await interaction.editReply({
				content: ' ',
				embeds: [infoMessageEmbed(':x: There has been an error', 'ERROR')],
			});

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
