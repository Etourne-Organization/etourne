import fs from 'fs';

import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';
import { getAllColumnValueById } from '../../supabase/supabaseFunctions/events';

import { Command } from '../CommandStructure';
import infoMessageEmbed from '../../globalUtils/infoMessageEmbed';

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
							}> (Message link: https://discord.com/channels/${
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
					return await interaction.reply({
						content: 'Sharing event',
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
