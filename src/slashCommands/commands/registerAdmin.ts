import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import { Command } from '../Command';

import logFile from '../../globalUtils/logFile';
import infoMessageEmbed, { types } from '../../globalUtils/infoMessageEmbed';
import { checkServerExists } from '../../supabase/supabaseFunctions/servers';
import {
	checkAddUser,
	checkUserExists,
} from '../../supabase/supabaseFunctions/users';
import commandIds from '../../commandIds';

const registerAdmin: Command = {
	name: 'registeradmin',
	description: 'Register user who added the bot as Admin in Etourne database',
	type: 'CHAT_INPUT',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			await interaction.reply({
				content: ':hourglass_flowing_sand:  Processing...',
			});

			if (
				!(await checkServerExists({
					discordServerId: interaction.guild!.id,
				}))
			) {
				return await interaction.editReply({
					embeds: [
						infoMessageEmbed({
							title: ':warning: Your server is not registered in Etourne Database.',
							description: `Please register your server by running </registerserver:${commandIds.REGISTER_SERVER}>`,
							type: types.ERROR,
						}),
					],
					content: ' ',
				});
			}
			if (
				await checkUserExists({
					discordServerId: interaction.guild!.id,
					discordUserId: interaction.user.id,
				})
			) {
				return await interaction.editReply({
					embeds: [
						infoMessageEmbed({
							title: ':warning: You are already registered in Etourne database!',
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

				await checkAddUser({
					username: log!.executor!.tag,
					discordServerId: interaction.guild!.id,
					discordUserId: log!.executor!.id,
					roleId: 3,
				});

				return await interaction.editReply({
					embeds: [
						infoMessageEmbed({
							title: ':white_check_mark: You have been registered!',
							type: types.SUCCESS,
						}),
					],
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
				file: 'registerAdmin',
			});
		}
	},
};

export default registerAdmin;
