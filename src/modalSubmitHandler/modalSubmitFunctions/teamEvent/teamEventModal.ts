import fs from 'fs';

import {
	Client,
	ModalSubmitInteraction,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
} from 'discord.js';
import momentTimezone from 'moment-timezone';

import { ModalFunction } from '../../ModalSubmitStructure';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';
import {
	addEvent,
	setColumnValue,
} from '../../../supabase/supabaseFunctions/events';

const teamEventModal: ModalFunction = {
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
						value: `<t:${momentTimezone
							.tz(eventDateTime, 'DD/MM/YYYY hh:mm', timezone)
							.unix()}:F>`,
						inline: true,
					},
					{ name: 'Game name', value: gameName, inline: true },
					{
						name: 'Num of team limit',
						value: 'Unlimited',
					},
					{
						name: 'Num of team member limit',
						value: 'Unlimited',
					},
					{ name: 'Hosted by', value: `${interaction.user.tag}` },
				]);

			const buttons = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId('createTeam')
					.setLabel('Create Team')
					.setStyle('PRIMARY'),
				new MessageButton()
					.setCustomId('setNumTeamLimit')
					.setLabel('Set num of team limit')
					.setStyle('SECONDARY'),
				new MessageButton()
					.setCustomId('setNumTeamMemberLimit')
					.setLabel('Set num of team member limit')
					.setStyle('SECONDARY'),
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
					momentTimezone
						.tz(eventDateTime, 'DD/MM/YYYY hh:mm', timezone)
						.format(),
				).toISOString(),
				isTeamEvent: true,
				discordServerId: interaction.guild.id,
				timezone: timezone,
				serverName: interaction.guild.name,
			});

			eventEmbed.setFooter({
				text: `Event ID: ${id}`,
			});

			const reply = await interaction.channel?.send({
				embeds: [eventEmbed],
				components: [buttons],
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
					infoMessageEmbed(
						':white_check_mark: Team event created successfully',
						'SUCCESS',
					),
				],
				ephemeral: true,
			});
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in modalFunctions/teamEvent/teamEventModal.ts \n Actual error: ${err} \n \n`,
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

export default teamEventModal;
