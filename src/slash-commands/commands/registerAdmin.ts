import fs from 'fs';

import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import { Command } from '../CommandStructure';

import infoMessageEmbed from '../../globalUtils/infoMessageEmbed';
import { checkServerExists } from '../../supabase/supabaseFunctions/servers';
import {
	checkAddUser,
	checkUserExists,
} from '../../supabase/supabaseFunctions/users';

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
				console.log('hello 2');

				return await interaction.reply({
					embeds: [
						infoMessageEmbed(
							'Your server is not registered in Etourne Database. Please register your server by running /registerserver command',
						),
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
						infoMessageEmbed(
							'You are already registered in Etourne database!',
						),
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
							infoMessageEmbed(
								':warning: You are not the user who added the bot into this server!',
								'ERROR',
							),
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
						infoMessageEmbed(
							':white_check_mark: You are registered!',
							'SUCCESS',
						),
					],
				});
			}
		} catch (err) {
			await interaction.reply({
				embeds: [infoMessageEmbed(':x: There has been an error', 'ERROR')],
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
