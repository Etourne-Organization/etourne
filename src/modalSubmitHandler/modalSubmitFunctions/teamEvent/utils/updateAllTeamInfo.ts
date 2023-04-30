import fs from 'fs';

import {
	ModalSubmitInteraction,
	MessageEmbed,
	MessageButton,
	MessageActionRow,
} from 'discord.js';
import momentTimezone from 'moment-timezone';

import {
	getAllColumnValueById,
	getColumnValueByEventId,
} from '../../../../supabase/supabaseFunctions/teams';
import { getColumnValueById } from '../../../../supabase/supabaseFunctions/events';

interface updateAllTeamInfo {
	eventId: number;
	interaction: ModalSubmitInteraction;
}

const updateAllTeamInfo = async (props: updateAllTeamInfo) => {
	try {
		const { eventId, interaction } = props;

		const values: any = await getColumnValueByEventId({
			eventId: eventId,
			columnName: '*',
		});

		if (values.length > 0) {
			for (const value of values) {
				const fetchedMessage = await interaction.channel?.messages.fetch(
					value['messageId'],
				);

				if (fetchedMessage) {
					// get registered team players
					const registeredPlayers:
						| {
								name: string;
								value: string;
								inline: boolean;
						  }
						| any = fetchedMessage.embeds[0].fields?.find((r) =>
						r.name.includes('Registered players'),
					);

					const numRegisteredPlayers: number = parseInt(
						registeredPlayers.name.split(' ')[2].split('/')[0],
					);

					const eventInfo: any = await getColumnValueById({
						id: eventId,
						columnName:
							'eventName, dateTime, timezone, maxNumTeamPlayers',
					});

					const date = new Date(
						momentTimezone
							.tz(eventInfo[0]['dateTime'], eventInfo[0]['timezone'])
							.format(),
					);

					const [day, month, year, hour, minute] = [
						date.getDate(),
						date.getMonth() + 1,
						date.getFullYear(),
						date.getHours(),
						date.getMinutes(),
					];

					const editedEmbed = new MessageEmbed()
						.setColor('#3a9ce2')
						.setTitle(value['name'])
						.setDescription(`>>> ${value['description']}`)
						.addFields([
							{
								name: 'Team Leader',
								value: interaction.user.tag,
							},
							{
								name: 'Event Name',
								value: eventInfo[0]['eventName'],
							},
							{
								name: 'Event Date and Time',
								value: `<t:${momentTimezone
									.tz(
										`${day}/${month}/${year} ${hour}:${minute}`,
										'DD/MM/YYYY hh:mm',
										eventInfo[0]['timezone'],
									)
									.unix()}:F>`,
							},
							{
								name: `Registered players ${numRegisteredPlayers}/${eventInfo[0]['maxNumTeamPlayers']}`,
								value:
									registeredPlayers.value.length <= 0
										? ' '
										: registeredPlayers.value,
							},
						])
						.setFooter({
							text: `Team ID: ${value['id']} Event ID: ${eventId}`,
						});

					await fetchedMessage.edit({
						embeds: [editedEmbed],
					});
				}
			}
		}
	} catch (err) {
		try {
			fs.appendFile(
				'logs/crash_logs.txt',
				`${new Date()} : Something went wrong in modalFunctions/teamEvent/utils/updateAllTeamInfo.ts \n Actual error: ${err} \n \n`,
				(err) => {
					if (err) throw err;
				},
			);
		} catch (err) {
			console.log('Error logging failed');
		}
	}
};

export default updateAllTeamInfo;
