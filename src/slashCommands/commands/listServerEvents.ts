import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';
import dayjs from 'dayjs';

import logFile from '../../globalUtils/logFile';
import { Command } from '../Command';
import { getAllServerEvents } from '../../supabase/supabaseFunctions/events';
import infoMessageEmbed, { types } from '../../globalUtils/infoMessageEmbed';
import { checkServerExists } from '../../supabase/supabaseFunctions/servers';
import commandIds from '../../commandIds';
import errorMessageTemplate from '../../globalUtils/errorMessageTemplate';
import botConfig from '../../botConfig';

const listServerEvents: Command = {
	name: 'listserverevents',
	description: 'View the list of all the servers',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			await interaction.reply({
				content: ':hourglass_flowing_sand:  Processing...',
				ephemeral: true,
			});

			if (
				!(await checkServerExists({
					discordServerId: interaction.guild!.id,
				}))
			) {
				const embed = new MessageEmbed()
					.setColor(botConfig.color.red)
					.setTitle(':x: Error: Server not registered!')
					.setDescription(
						`Use </registerserver:${commandIds.REGISTER_SERVER}> command to register your server in Etourne database.`,
					)
					.setFooter({
						text: 'Use /support to seek support if required.',
					})
					.setTimestamp();

				return await interaction.editReply({
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
				.setColor(botConfig.color.default)
				.setTitle(`All events in ${interaction.guild?.name}`)
				.setThumbnail(`${interaction.guild!.iconURL()}`)
				.setDescription(eventString);

			await interaction.channel?.send({
				embeds: [embed],
			});

			return await interaction.editReply({
				content: ' ',
				embeds: [
					infoMessageEmbed({
						title: ':white_check_mark: List of all events shared successfully',
						type: types.SUCCESS,
					}),
				],
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
				folder: 'slashCommands/commands',
				file: 'listServerEvent',
			});
		}
	},
};

export default listServerEvents;
