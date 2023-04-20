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
import {
	updateEvent,
	getColumnValueById,
} from '../../../supabase/supabaseFunctions/events';

const editTeamEventInfoModal: ModalFunction = {
	customId: 'editTeamEventInfoModal',
	run: async (client: Client, interaction: ModalSubmitInteraction) => {
		try {
			const eventId: string | any =
				interaction.message?.embeds[0].footer?.text.split(': ')[1];

			const eventName = interaction.fields.getTextInputValue('eventName');
			const gameName = interaction.fields.getTextInputValue('gameName');
			const timezone = interaction.fields.getTextInputValue('timezone');
			const eventDateTime = interaction.fields.getTextInputValue('date');
			const description =
				interaction.fields.getTextInputValue('eventDescription');

			const numTeamLimit: any = await getColumnValueById({
				id: eventId,
				columnName: 'numTeamLimit',
			});

			const numTeamPlayerLimit: any = await getColumnValueById({
				id: eventId,
				columnName: 'numTeamMemberLimit',
			});

			const editedEmbed = new MessageEmbed()
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
						value: numTeamLimit[0]['numTeamLimit']
							? numTeamLimit[0]['numTeamLimit']
							: 'Unlimited',
					},
					{
						name: 'Num of team member limit',
						value: numTeamPlayerLimit[0]['numTeamMemberLimit']
							? numTeamPlayerLimit[0]['numTeamMemberLimit']
							: 'Unlimited',
					},
					{ name: 'Hosted by', value: `${interaction.user.tag}` },
				])
				.setFooter({
					text: `Event ID: ${eventId}`,
				});

			/* buttons */
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

			await updateEvent({
				eventId: eventId,
				eventName: eventName,
				gameName: gameName,
				description: description,
				dateTime: new Date(
					momentTimezone
						.tz(eventDateTime, 'DD/MM/YYYY hh:mm', timezone)
						.format(),
				).toISOString(),
				isTeamEvent: false,
				discordServerId: interaction.guild.id,
				timezone: timezone,
			});

			return await interaction.update({
				embeds: [editedEmbed],
				components: [buttons],
			});
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in modalFunctions/teamEvent/editTeamEventInfoModal.ts \n Actual error: ${err} \n \n`,
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

export default editTeamEventInfoModal;
