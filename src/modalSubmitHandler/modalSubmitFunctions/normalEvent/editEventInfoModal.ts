import fs from 'fs';

import { Client, ModalSubmitInteraction, MessageEmbed } from 'discord.js';
import moment from 'moment-timezone';

import { ModalFunction } from '../../ModalSubmitStructure';
import { updateEvent } from '../../../supabase/supabaseFunctions/events';
import {
	isoParsingDateFormat,
	isoTimeFormat,
	getTimzeonValueFromLabel,
} from '../../../utilities/timezone';

const editEventInfoModal: ModalFunction = {
	customId: 'editEventInfoModal',
	run: async (client: Client, interaction: ModalSubmitInteraction) => {
		try {
			const eventId: string | any =
				interaction.message?.embeds[0].footer?.text.split(': ')[1];

			const registeredPlayers:
				| {
						name: string;
						value: string;
						inline: boolean;
				  }
				| any = interaction.message?.embeds[0].fields?.find((r) =>
				r.name.includes('Registered players'),
			);

			const eventDateTimeEmbedValue:
				| {
						name: string;
						value: string;
						inline: boolean;
				  }
				| any = interaction.message?.embeds[0].fields?.find((r) =>
				r.name.includes('Event date & time'),
			);

			const eventHost:
				| {
						name: string;
						value: string;
						inline: boolean;
				  }
				| any = interaction.message?.embeds[0].fields?.find((r) =>
				r.name.includes('Hosted by'),
			);

			const eventName = interaction.fields.getTextInputValue('eventName');
			const gameName = interaction.fields.getTextInputValue('gameName');
			const timezone = interaction.fields.getTextInputValue('timezone');
			const eventDateTime = interaction.fields.getTextInputValue('date');
			const description =
				interaction.fields.getTextInputValue('eventDescription');

			const editedEmbed = new MessageEmbed()
				.setColor('#3a9ce2')
				.setTitle(eventName)
				.setDescription(
					`**----------------------------------------** \n **Event description:** \n \n >>> ${description}  \n \n`,
				)
				.addFields([
					{
						name: 'Event date & time',
						value: eventDateTime
							? `<t:${moment
									.tz(
										`${eventDateTime.split(' ')[0]}T${
											eventDateTime.split(' ')[1]
										}`,
										`${isoParsingDateFormat}T${isoTimeFormat}`,
										getTimzeonValueFromLabel(timezone),
									)
									.unix()}:F>`
							: eventDateTimeEmbedValue['value'],
						inline: true,
					},
					{ name: 'Game name', value: gameName, inline: true },
					{ name: 'Hosted by', value: `${eventHost.value}` },
					{
						name: registeredPlayers.name,
						value:
							registeredPlayers.value.length <= 0
								? ' '
								: registeredPlayers.value,
					},
				])
				.setFooter({
					text: `Event ID: ${eventId}`,
				});

			if (!interaction.inCachedGuild()) return;

			await updateEvent({
				eventId: eventId,
				eventName: eventName,
				gameName: gameName,
				description: description,
				dateTime: eventDateTime
					? new Date(
							moment
								.tz(
									`${eventDateTime.split(' ')[0]}T${
										eventDateTime.split(' ')[1]
									}`,
									`${isoParsingDateFormat}T${isoTimeFormat}`,
									getTimzeonValueFromLabel(timezone),
								)
								.format(),
					  ).toISOString()
					: null,
				isTeamEvent: false,
				discordServerId: interaction.guild.id,
				timezone: timezone,
			});

			return await interaction.update({
				embeds: [editedEmbed],
			});
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in modalFunctions/normalEvent/editEventInfoModal.ts \n Actual error: ${err} \n \n`,
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

export default editEventInfoModal;
