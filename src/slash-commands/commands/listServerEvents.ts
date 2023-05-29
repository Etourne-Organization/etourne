import fs from 'fs';

import {
	BaseCommandInteraction,
	Client,
	Message,
	MessageEmbed,
} from 'discord.js';
import momentTimezone from 'moment-timezone';

import { Command } from '../CommandStructure';
import { getAllServerEvents } from '../../supabase/supabaseFunctions/events';
import infoMessageEmbed from '../../globalUtils/infoMessageEmbed';

const listServerEvents: Command = {
	name: 'listserverevents',
	description: 'View the list of all the servers',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			const allEvents = await getAllServerEvents({
				discordServerId: interaction.guild!.id,
			});

			let eventString: string = allEvents.length > 0 ? '' : 'No events';

			allEvents.forEach((e) => {
				const date = new Date(
					momentTimezone.tz(e['dateTime'], e['timezone']).format(),
				);

				console.log('date', date);

				const [day, month, year, hour, minute] = [
					date.getDate(),
					date.getMonth() + 1,
					date.getFullYear(),
					date.getHours(),
					date.getMinutes(),
				];

				// console.log(`${day}/${month}/${year} ${hour}:${minute}`);
				// console.log(new Date(e['dateTime']));

				eventString += `## ${e.eventName}\n**ID:** ${
					e.id
				}\n**Game name:** ${
					e.gameName
				}\n**Date and Time:** <t:${momentTimezone
					.tz(
						`${day}/${month}/${year} ${hour}:${minute}`,
						'DD/MM/YYYY hh:mm',
						e.timezone,
					)
					.unix()}:F>\n**Event type:** ${
					e.isTeamEvent ? 'Team' : 'Normal (no team)'
				}\n\n`;
			});

			const embed = new MessageEmbed()
				.setColor('#3a9ce2')
				.setTitle(`All events in ${interaction.guild?.name}`)
				.setThumbnail(`${interaction.guild!.iconURL()}`)
				.setDescription(eventString);

			await interaction.reply({
				embeds: [embed],
			});
		} catch (err) {
			console.log(err);
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in slashcommands/serverEventsList.ts \n Actual error: ${err} \n \n`,
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

export default listServerEvents;
