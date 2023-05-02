import fs from 'fs';

import { BaseCommandInteraction, Client, User } from 'discord.js';

import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';
import { Command } from '../../CommandStructure';
import {
	getUserRole,
	setUserRole as setUserRoleSupabase,
	isUserSuperAdmin,
} from '../../../supabase/supabaseFunctions/users';

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
					value: '3',
				},
				{
					name: 'Admin',
					value: '4',
				},
			],
		},
	],
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
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
					- If the executor is admin/super admin or not: reject if not
					- If the target is super admin: reject if yes
			*/
			if (interaction.user.id !== '374230181889572876') {
				if (
					userRoleDB.length === 0 ||
					(userRoleDB[0]['roleId'] !== 4 &&
						userRoleDB[0]['roleId'] !== 5454)
				) {
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

				const isTargetUserSuperAdmin: any = await isUserSuperAdmin({
					discordUserId: user!.id,
				});

				if (isTargetUserSuperAdmin) {
					return await interaction.reply({
						embeds: [
							infoMessageEmbed(
								":x: Please contact mz10ah#0054 or Etourne support as this user's role cannot be changed.",
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
