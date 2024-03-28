import { BaseCommandInteraction, Client, User, MessageEmbed } from 'discord.js';

import logFile from '../../globalUtils/logFile';
import infoMessageEmbed, { types } from '../../globalUtils/infoMessageEmbed';
import { Command } from '../Command';
import {
	getUserRole,
	setUserRole as setUserRoleSupabase,
} from '../../supabase/supabaseFunctions/users';
import { checkServerExists } from '../../supabase/supabaseFunctions/servers';
import commandIds from '../../commandIds';
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
						`Use </registerserver:${commandIds.REGISTER_SERVER}> command to register your server in Etourne database.`,
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
							infoMessageEmbed({
								title: ':warning: You are not allowed run this command!',
								type: types.ERROR,
							}),
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
					infoMessageEmbed({
						title: `:white_check_mark: ${user!.tag}'s role has been set!`,
						type: types.SUCCESS,
					}),
				],
				ephemeral: true,
			});
		} catch (err) {
			await interaction.reply({
				embeds: [
					infoMessageEmbed({
						title: errorMessageTemplate().title,
						description: errorMessageTemplate().description,
						type: types.ERROR,
					}),
				],
				ephemeral: true,
			});

			logFile({
				error: err,
				folder: 'slashCommands/commands',
				file: 'setUserRole',
			});
		}
	},
};

export default setUserRole;
