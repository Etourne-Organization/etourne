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

const teamEventModal: ModalSubmit = {
	customId: 'teamEventModalSubmit',
	run: async (client: Client, interaction: ModalSubmitInteraction) => {
		try {
			const eventName = interaction.fields.getTextInputValue('eventName');
			const gameName = interaction.fields.getTextInputValue('gameName');
			const timezone = interaction.fields.getTextInputValue('timezone');
			const eventDateTime = interaction.fields.getTextInputValue('date');
			const description =
				interaction.fields.getTextInputValue('eventDescription');

			const eventEmbed = new MessageEmbed()
				.setColor('#3a9ce2')
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
					{
						name: 'Max num of teams',
						value: 'Unlimited',
					},
					{
						name: 'Max num of team players',
						value: 'Unlimited',
					},
					{ name: 'Hosted by', value: `${interaction.user.tag}` },
				]);

			const buttons = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId('createTeam')
					.setLabel('Create Team')
					.setStyle('PRIMARY'),
			);

			const setMaxNumButtons = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId('setMaxNumTeams')
					.setLabel('Set max num of teams')
					.setStyle('SECONDARY'),
				new MessageButton()
					.setCustomId('setMaxNumTeamPlayers')
					.setLabel('Set max num of team players')
					.setStyle('SECONDARY'),
			);

			const manageEventButtons = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId('editTeamEventInfo')
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
				eventHost: interaction.user.tag,
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
				isTeamEvent: true,
				discordServerId: interaction.guild.id,
				timezone: timezone,
				channelId: interaction.channel!.id,
				discordServerName: interaction.guild.name,
			});

			eventEmbed.setFooter({
				text: `Event ID: ${id}`,
			});

			const reply = await interaction.channel?.send({
				embeds: [eventEmbed],
				components: [buttons, setMaxNumButtons, manageEventButtons],
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

			await interaction.reply({
				embeds: [
					infoMessageEmbed({
						title: ':white_check_mark: Team event created successfully',
						type: types.SUCCESS,
					}),
				],
				ephemeral: true,
			});
		} catch (err) {
			await interaction.reply({
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
				file: 'teamEvent/teamEventModal',
			});
		}
	},
};

export default teamEventModal;
