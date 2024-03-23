import fs from 'fs';

import { BaseCommandInteraction, Client, User, MessageEmbed } from 'discord.js';

import infoMessageEmbed from '../../globalUtils/infoMessageEmbed';
import { Command } from '../Command';
import {
	getUserRole,
	setUserRole as setUserRoleSupabase,
} from '../../supabase/supabaseFunctions/users';
import { checkServerExists } from '../../supabase/supabaseFunctions/servers';
import testCommandIDs from '../../TEST_COMMAND_IDS/commandIDs.json';
import originalCommandIDs from '../../ORIGINAL_COMMAND_IDS/commandIDs.json';
import errorMessageTemplate from '../../globalUtils/errorMessageTemplate';

const setUserRole: Command = {
	name: 'setuserrole',
	description: 'Set user role',
	type: 'CHAT_INPUT',
	options: [
		{
			name: 'user',
			description: 'Select user',
			type: 'USER',
			required: true,
		},
		{
			name: 'role',
			description: 'Select role to assign',
			type: 'STRING',
			required: true,
			choices: [
				{
					name: 'Player',
					value: '1',
				},
				{
					name: 'Manager',
					value: '2',
				},
				{
					name: 'Admin',
					value: '3',
				},
			],
		},
	],
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

			const user: User | null = interaction.options.getUser('user');
			const role: { name: string; type: string; value: string } | any =
				interaction.options.get('role');

			const userRoleDB: any = await getUserRole({
				discordUserId: interaction.user.id,
				discordServerId: interaction.guild!.id,
			});

			// only the creator of the bot can run this command with no restriction
			/*
				Checks:
					- If the executor is admin or not: reject if not
			*/
			if (interaction.user.id !== '374230181889572876') {
				if (userRoleDB.length === 0 || userRoleDB[0]['roleId'] !== 3) {
					return await interaction.reply({
						embeds: [
							infoMessageEmbed(
								':warning: You are not allowed to run this command!',
								'WARNING',
							),
						],
						ephemeral: true,
					});
				}
			}

			await setUserRoleSupabase({
				discordServerId: interaction.guild!.id,
				discordUserId: user!.id,
				roleId: parseInt(role.value),
				username: user!.tag,
			});

			await interaction.reply({
				embeds: [
					infoMessageEmbed(
						`:white_check_mark: ${user!.tag}'s role has been set!`,
					),
				],
				ephemeral: true,
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
					`${new Date()} : Something went wrong in slashcommands/setUserRole/setUserRole.ts \n Actual error: ${err} \n \n`,
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

export default setUserRole;
