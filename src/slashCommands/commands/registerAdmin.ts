import fs from 'fs';

import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import { Command } from '../Command';

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
			if (
				!(await checkServerExists({
					discordServerId: interaction.guild!.id,
				}))
			) {
				return await interaction.reply({
					embeds: [
						infoMessageEmbed({
							title: ':warning: Your server is not registered in Etourne Database.',
							description: `Please register your server by running </registerserver:${commandIds.REGISTER_SERVER}>`,
							type: types.ERROR,
						}),
					],
				});
			}
			if (
				await checkUserExists({
					discordServerId: interaction.guild!.id,
					discordUserId: interaction.user.id,
				})
			) {
				return await interaction.reply({
					embeds: [
						infoMessageEmbed({
							title: ':warning: You are already registered in Etourne database!',
							type: types.ERROR,
						}),
					],
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
					return await interaction.reply({
						embeds: [
							infoMessageEmbed({
								title: ':warning: You are not the user who added the bot into this server!',
								type: types.ERROR,
							}),
						],
					});
				}

				await checkAddUser({
					username: log!.executor!.tag,
					discordServerId: interaction.guild!.id,
					discordUserId: log!.executor!.id,
					roleId: 3,
				});

				return await interaction.reply({
					embeds: [
						infoMessageEmbed({
							title: ':white_check_mark: You are registered!',
							type: types.SUCCESS,
						}),
					],
				});
			}
		} catch (err) {
			await interaction.reply({
				embeds: [
					infoMessageEmbed({
						title: ':x: There has been an error',
						type: types.ERROR,
					}),
				],
				ephemeral: true,
			});

			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in slashcommands/registerAdmin.ts \n Actual error: ${err} \n \n`,
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

export default registerAdmin;
