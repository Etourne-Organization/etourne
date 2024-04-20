import {
	BaseCommandInteraction,
	Client,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
} from 'discord.js';
import dayjs from 'dayjs';

import logFile from '../../globalUtils/logFile';
import {
	getAllColumnValueById,
	setColumnValue,
} from '../../supabase/supabaseFunctions/events';
import { Command } from '../Command';
import infoMessageEmbed, { types } from '../../globalUtils/infoMessageEmbed';
import { getUserRole } from '../../supabase/supabaseFunctions/users';
import { getAllPlayers } from '../../supabase/supabaseFunctions/singlePlayers';
import { checkServerExists } from '../../supabase/supabaseFunctions/servers';
import commandIds from '../../commandIds';
import errorMessageTemplate from '../../globalUtils/errorMessageTemplate';
import botConfig from '../../botConfig';

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
			await interaction.reply({
				content: ':hourglass_flowing_sand:  Processing...',
				ephemeral: true,
			});

			if (
				!(await checkServerExists({
					discordServerId: interaction.guild!.id,
				}))
			) {
				const embed = new MessageEmbed()
					.setColor(botConfig.color.red)
					.setTitle(':x: Error: Server not registered!')
					.setDescription(
						`Use </registerserver:${commandIds.REGISTER_SERVER}> command to register your server in Etourne database.`,
					)
					.setFooter({
						text: 'Use /support to seek support if required.',
					})
					.setTimestamp();

				return await interaction.editReply({
					embeds: [embed],
					content: ' ',
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
						infoMessageEmbed({
							title: ':warning: You are not allowed run this command!',
							type: types.ERROR,
						}),
					],
				});
			}

			await interaction.editReply({
				content: ':arrows_counterclockwise:  Getting event ...',
			});

			const eventInfo: any = await getAllColumnValueById({
				id: eventId.value,
			});

			if (eventInfo.length > 0) {
				if (eventInfo[0].channelId) {
					const fetchedChannel = await interaction.guild?.channels.fetch(
						eventInfo[0].channelId,
					);

					let fetchedMessage;

					if (fetchedChannel!.isText()) {
						fetchedMessage = await fetchedChannel.messages
							.fetch(eventInfo[0].messageId)
							.catch();
					}

					if (fetchedMessage) {
						const embed = new MessageEmbed()
							.setColor(botConfig.color.red)
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
					}
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
						.setColor(botConfig.color.default)
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

					const newEventEmbed = await interaction.channel?.send({
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
								value: newEventEmbed!.id,
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
							infoMessageEmbed({
								title: ':white_check_mark: Event reshared Successfully',
								type: types.SUCCESS,
							}),
						],
					});
				}
			} else {
				return await interaction.editReply({
					content: ' ',
					embeds: [
						infoMessageEmbed({
							title: ':x: Event cannot be found',
							type: types.ERROR,
						}),
					],
				});
			}
		} catch (err) {
			await interaction.editReply({
				embeds: [
					infoMessageEmbed({
						title: errorMessageTemplate().title,
						description: errorMessageTemplate().description,
						type: types.ERROR,
					}),
				],
				content: ' ',
			});

			logFile({
				error: err,
				folder: 'slashCommands/commands',
				file: 'getEvent',
			});
		}
	},
};

export default getEvent;
