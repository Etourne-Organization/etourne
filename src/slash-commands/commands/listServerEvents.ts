import fs from 'fs';

import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';
import dayjs from 'dayjs';

import { Command } from '../CommandStructure';
import { getAllServerEvents } from '../../supabase/supabaseFunctions/events';
import infoMessageEmbed from '../../globalUtils/infoMessageEmbed';
import { checkServerExists } from '../../supabase/supabaseFunctions/servers';
import testCommandIDs from '../../TEST_COMMAND_IDS/commandIDs.json';
import originalCommandIDs from '../../ORIGINAL_COMMAND_IDS/commandIDs.json';
import errorMessageTemplate from '../../globalUtils/errorMessageTemplate';

const listServerEvents: Command = {
	name: 'listserverevents',
	description: 'View the list of all the servers',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			if (
				!(await checkServerExists({
					discordServerId: interaction.guild!.id,
				}))
			) {
				const embed = new MessageEmbed()
					.setColor('#D83C3E')
					.setTitle(':x: Error: Server not registered!')
					.setDescription(
						`Use ${
							process.env.COMMAND_ID === 'TEST_COMMAND_IDS'
								? `</registerserver:${testCommandIDs.REGISTER_SERVER}>`
								: `</registerserver:${originalCommandIDs.REGISTER_SERVER}>`
						} command to register your server in Etourne database.`,
					)
					.setFooter({
						text: 'Use /support to seek support if required.',
					})
					.setTimestamp();

				return await interaction.reply({
					embeds: [embed],
				});
			}

			const allEvents = await getAllServerEvents({
				discordServerId: interaction.guild!.id,
			});

			let eventString: string = allEvents.length > 0 ? '' : 'No events';

			allEvents.forEach((e) => {
				eventString += `## ${e.eventName}\n**ID:** ${
					e.id
				}\n**Game name:** ${e.gameName}\n**Date and Time:** <t:${dayjs(
					e['dateTime'],
				).unix()}:F>\n**Event type:** ${
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
			await interaction.reply({
				embeds: [
					infoMessageEmbed(
						errorMessageTemplate().title,
						'ERROR',
						errorMessageTemplate().description,
					),
				],
				ephemeral: true,
			});

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
