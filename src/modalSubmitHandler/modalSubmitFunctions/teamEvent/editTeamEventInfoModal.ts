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
import updateAllTeamInfo from './utils/updateAllTeamInfo';

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
						value: maxNumTeams[0]['maxNumTeams']
							? maxNumTeams[0]['maxNumTeams'].toString()
							: 'Unlimited',
					},
					{
						name: 'Num of team member limit',
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
				dateTime: new Date(
					momentTimezone
						.tz(eventDateTime, 'DD/MM/YYYY hh:mm', timezone)
						.format(),
				).toISOString(),
				isTeamEvent: false,
				discordServerId: interaction.guild.id,
				timezone: timezone,
			});

			updateAllTeamInfo({
				eventId: eventId,
				interaction: interaction,
			});

			return await interaction.update({
				embeds: [editedEmbed],
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
