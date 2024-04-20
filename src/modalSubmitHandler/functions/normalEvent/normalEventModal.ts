import {
	Client,
	ModalSubmitInteraction,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
} from 'discord.js';
import moment from 'moment-timezone';

import logFile from '../../../globalUtils/logFile';
import { ModalSubmit } from '../../ModalSubmit';
import infoMessageEmbed, { types } from '../../../globalUtils/infoMessageEmbed';
import {
	addEvent,
	setColumnValue,
} from '../../../supabase/supabaseFunctions/events';
import {
	isoParsingDateFormat,
	isoTimeFormat,
	getTimzeonValueFromLabel,
} from '../../../utilities/timezone';
import errorMessageTemplate from '../../../globalUtils/errorMessageTemplate';
import botConfig from '../../../botConfig';

const normalEventModal: ModalSubmit = {
	customId: 'normalEventModalSubmit',
	run: async (client: Client, interaction: ModalSubmitInteraction) => {
		try {
			await interaction.reply({
				content: ':hourglass_flowing_sand:  Creating event...',
				ephemeral: true,
			});

			const eventName = interaction.fields.getTextInputValue('eventName');
			const gameName = interaction.fields.getTextInputValue('gameName');
			const timezone = interaction.fields.getTextInputValue('timezone');
			const eventDateTime = interaction.fields.getTextInputValue('dateTime');
			const description =
				interaction.fields.getTextInputValue('eventDescription');

			const eventEmbed = new MessageEmbed()
				.setColor(botConfig.color.default)
				.setTitle(eventName)
				.setDescription(
					`**----------------------------------------** \n **Event description:** \n \n >>> ${description}  \n \n`,
				)
				.addFields([
					{
						name: 'Event date & time',
						value: `<t:${moment
							.tz(
								`${eventDateTime.split(' ')[0]}T${
									eventDateTime.split(' ')[1]
								}`,
								`${isoParsingDateFormat}T${isoTimeFormat}`,
								getTimzeonValueFromLabel(timezone),
							)
							.unix()}:F>`,
						inline: true,
					},
					{ name: 'Game name', value: gameName, inline: true },
					{ name: 'Hosted by', value: `${interaction.user.username}` },
					{ name: `Registered players 0/unlimited`, value: ` ` },
				]);

			/* buttons */
			const buttons = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId('normalEventRegister')
					.setLabel('Register yourself')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('normalEventUnregister')
					.setLabel('Unregister yourself')
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

			if (!interaction.inCachedGuild()) return;

			const id = await addEvent({
				eventName: eventName,
				gameName: gameName,
				description: description,
				dateTime: new Date(
					moment
						.tz(
							`${eventDateTime.split(' ')[0]}T${
								eventDateTime.split(' ')[1]
							}`,
							`${isoParsingDateFormat}T${isoTimeFormat}`,
							getTimzeonValueFromLabel(timezone),
						)
						.format(),
				).toISOString(),
				isTeamEvent: false,
				discordServerId: interaction.guild.id,
				timezone: timezone,
				eventHost: interaction.user.username,
				channelId: interaction.channel!.id,
				discordServerName: interaction.guild.name,
			});

			eventEmbed.setFooter({
				text: `Event ID: ${id}`,
			});

			const reply = await interaction.channel?.send({
				embeds: [eventEmbed],
				components: [buttons, managePlayerButtons, manageEventButtons],
			});

			await setColumnValue({
				data: [
					{
						id: id,
						key: 'messageId',
						value: reply!.id,
					},
				],
			});

			await interaction.editReply({
				embeds: [
					infoMessageEmbed({
						title: ':white_check_mark: Event created successfully!',
						type: types.SUCCESS,
					}),
				],
				content: ' ',
			});
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
				folder: 'modalSubmitHandler/functions',
				file: 'normalEvent/normalEventModal',
			});
		}
	},
};

export default normalEventModal;
