import { Client, ModalSubmitInteraction, MessageEmbed } from 'discord.js';
import moment from 'moment-timezone';

import logFile from '../../../globalUtils/logFile';
import { ModalSubmit } from '../../ModalSubmit';
import {
	updateEvent,
	getColumnValueById,
} from '../../../supabase/supabaseFunctions/events';
import updateAllTeamInfo from './utilities/updateAllTeamInfo';
import {
	getTimzeonValueFromLabel,
	isoParsingDateFormat,
	isoTimeFormat,
} from '../../../utilities/timezone';
import errorMessageTemplate from '../../../globalUtils/errorMessageTemplate';
import infoMessageEmbed, { types } from '../../../globalUtils/infoMessageEmbed';
import botConfig from '../../../botConfig';

const editTeamEventInfoModal: ModalSubmit = {
	customId: 'editTeamEventInfoModal',
	run: async (client: Client, interaction: ModalSubmitInteraction) => {
		try {
			await interaction.deferUpdate();

			const eventId: string | any =
				interaction.message?.embeds[0].footer?.text.split(': ')[1];

			const eventName = interaction.fields.getTextInputValue('eventName');
			const gameName = interaction.fields.getTextInputValue('gameName');
			const timezone = interaction.fields.getTextInputValue('timezone');
			const eventDateTime = interaction.fields.getTextInputValue('date');
			const description =
				interaction.fields.getTextInputValue('eventDescription');

			const maxNumTeams: any = await getColumnValueById({
				id: eventId,
				columnName: 'maxNumTeams',
			});

			const maxNumTeamPlayers: any = await getColumnValueById({
				id: eventId,
				columnName: 'maxNumTeamPlayers',
			});

			const eventHost:
				| {
						name: string;
						value: string;
						inline: boolean;
				  }
				| any = interaction.message?.embeds[0].fields?.find(
				(r) => r.name === 'Hosted by',
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

			const editedEmbed = new MessageEmbed()
				.setColor(botConfig.color.default)
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
					{
						name: 'Max num of teams',
						value: maxNumTeams[0]['maxNumTeams']
							? maxNumTeams[0]['maxNumTeams'].toString()
							: 'Unlimited',
					},
					{
						name: 'Max num of team players',
						value: maxNumTeamPlayers[0]['maxNumTeamPlayers']
							? maxNumTeamPlayers[0]['maxNumTeamPlayers'].toString()
							: 'Unlimited',
					},
					{ name: 'Hosted by', value: `${eventHost.value}` },
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

			updateAllTeamInfo({
				eventId: eventId,
				interaction: interaction,
			});

			await interaction.editReply({
				embeds: [editedEmbed],
			});

			return await interaction.followUp({
				embeds: [
					infoMessageEmbed({
						title: ':white_check_mark: Event updated successfully!',
						type: types.SUCCESS,
					}),
				],
				ephemeral: true,
			});
		} catch (err) {
			await interaction.followUp({
				embeds: [
					infoMessageEmbed({
						title: errorMessageTemplate().title,
						description: errorMessageTemplate().description,
						type: types.ERROR,
					}),
				],
				ephemeral: true,
			});

			logFile({
				error: err,
				folder: 'modalSubmitHandler/functions',
				file: 'teamEvent/editTeamEventInfoModal',
			});
		}
	},
};

export default editTeamEventInfoModal;
