import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import logFile from '../../globalUtils/logFile';
import { Command } from '../Command';
import infoMessageEmbed, { types } from '../../globalUtils/infoMessageEmbed';
import {
	checkServerExists,
	addServer,
} from '../../supabase/supabaseFunctions/servers';
import { checkAddUser } from '../../supabase/supabaseFunctions/users';
import botConfig from '../../botConfig';

const registerServer: Command = {
	name: 'registerserver',
	description: 'Register your Discord server in Etourne database',
	type: 'CHAT_INPUT',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			await interaction.reply({
				content: ':hourglass_flowing_sand:  Processing...',
			});

			if (
				await checkServerExists({ discordServerId: interaction.guild!.id })
			) {
				return await interaction.editReply({
					embeds: [
						infoMessageEmbed({
							title: ':warning: Your server is already registered!',
							type: types.ERROR,
						}),
					],
					content: ' ',
				});
			} else if (
				interaction.guild!.members.me?.permissions.has('VIEW_AUDIT_LOG')
			) {
				const fetchedLog = await interaction.guild!.fetchAuditLogs({
					type: 'BOT_ADD',
					limit: 1,
				});

				const log = fetchedLog.entries.first();

				if (log?.executor!.id !== interaction.user.id) {
					return await interaction.editReply({
						embeds: [
							infoMessageEmbed({
								title: ':warning: You are not the user who added the bot into this server!',
								type: types.ERROR,
							}),
						],
						content: ' ',
					});
				}

				await addServer({
					discordServerId: interaction.guild!.id,
					name: interaction.guild!.name,
				});

				await checkAddUser({
					username: log!.executor!.username,
					discordServerId: interaction.guild!.id,
					discordUserId: log!.executor!.id,
					roleId: 3,
				});

				return await interaction.editReply({
					embeds: [
						infoMessageEmbed({
							title: ':white_check_mark:  Discord server registered!',
							type: types.SUCCESS,
						}),
					],
					content: ' ',
				});
			} else {
				const embed = new MessageEmbed()
					.setColor(botConfig.color.red)
					.setTitle(':x: Error')
					.setDescription(
						'Please give the following permission to the bot: \n - `View Audit Log` \n \n## Why is this needed? \n This permission will allow the bot to retrieve the user who added the bot and make that user `Admin` (**NOT** server `Admin`) in Etourne software.',
					)
					.setTimestamp();

				return await interaction.editReply({
					embeds: [embed],
					content: ' ',
				});
			}
		} catch (err) {
			await interaction.editReply({
				embeds: [
					infoMessageEmbed({
						title: ':x: There has been an error',
						type: types.ERROR,
					}),
				],
				content: ' ',
			});

			logFile({
				error: err,
				folder: 'slashCommands/commands',
				file: 'registerServer',
			});
		}
	},
};

export default registerServer;
