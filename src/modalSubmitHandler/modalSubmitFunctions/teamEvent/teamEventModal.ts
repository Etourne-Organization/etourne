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
import teamEventInfoData from '../../../data/teamEventInfo';
import { addEvent } from '../../../supabase/supabaseFunctions/events';

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
				.addField(
					'Event date & time',
					`<t:${momentTimezone
						.tz(eventDateTime, 'DD/MM/YYYY hh:mm', timezone)
						.unix()}:F>`,
					true,
				)
				.addField('Game name', gameName, true)
				.addField(
					'Num of team limit',
					teamEventInfoData.numTeamLimit
						? `${teamEventInfoData.numTeamLimit}`
						: 'Unlimited',
				)
				.addField(
					'Num of team member limit',
					teamEventInfoData.numTeamMemberLimit
						? `${teamEventInfoData.numTeamMemberLimit}`
						: 'Unlimited',
				)
				.addField('Hosted by', `${interaction.user.tag}`);

			const buttons = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId('createTeam')
					.setLabel('Create Team')
					.setStyle('PRIMARY'),
			);

			if (!interaction.inCachedGuild()) return;

			// const id = await addEvent({
			// 	eventName: eventName,
			// 	description: description,
			// 	dateTime: new Date(
			// 		momentTimezone
			// 			.tz(eventDateTime, 'DD/MM/YYYY hh:mm', timezone)
			// 			.format(),
			// 	).toISOString(),
			// 	isTeamEvent: false,
			// 	serverId: parseInt(interaction.guild.id),
			// 	timezone: timezone,
			// 	serverName: interaction.guild.name,
			// });

			await interaction.channel?.send({
				embeds: [eventEmbed],
				components: [buttons],
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
