import fs from 'fs';

import { BaseCommandInteraction, Client, MessageEmbed } from 'discord.js';

import { Command } from '../CommandStructure';
import testCommandIDs from '../../TEST_COMMAND_IDS/commandIDs.json';
import originalCommandIDs from '../../ORIGINAL_COMMAND_IDS/commandIDs.json';
import infoMessageEmbed from '../../globalUtils/infoMessageEmbed';
import {
	checkServerExists,
	addServer,
} from '../../supabase/supabaseFunctions/servers';
import { checkAddUser } from '../../supabase/supabaseFunctions/users';

const registerServer: Command = {
	name: 'registerserver',
	description: 'Register your Discord server in Etourne database',
	type: 'CHAT_INPUT',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
			if (
				await checkServerExists({ discordServerId: interaction.guild!.id })
			) {
				return await interaction.reply({
					embeds: [infoMessageEmbed('Your server is already registered!')],
				});
			} else if (
				interaction.guild!.members.me?.permissions.has('VIEW_AUDIT_LOG')
			) {
				const fetchedLog = await interaction.guild!.fetchAuditLogs({
					type: 'BOT_ADD',
					limit: 1,
				});

				const log = fetchedLog.entries.first();

				await addServer({
					discordServerId: interaction.guild!.id,
					name: interaction.guild!.name,
				});

				await checkAddUser({
					username: log!.executor!.tag,
					discordServerId: interaction.guild!.id,
					discordUserId: log!.executor!.id,
					roleId: 3,
				});

				return await interaction.reply({
					embeds: [
						infoMessageEmbed(
							':white_check_mark: Discord server registered!',
							'SUCCESS',
						),
					],
				});
			} else {
				const embed = new MessageEmbed()
					.setColor('#D83C3E')
					.setTitle(':x: Error')
					.setDescription(
						'Please give the following permission to the bot: \n - `View Audit Log` \n \n## Why is this needed? \n This permission will allow the bot to retrieve the user who added the bot and make the user `Admin` (**NOT** server `Admin`) in Etourne software.',
					)
					.setTimestamp();

				return await interaction.reply({
					embeds: [embed],
				});
			}
		} catch (err) {
			console.log(err);

			await interaction.reply({
				embeds: [infoMessageEmbed(':x: There has been an error', 'ERROR')],
			});

			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in slashcommands/registerServer.ts \n Actual error: ${err} \n \n`,
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

export default registerServer;
