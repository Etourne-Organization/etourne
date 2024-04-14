import {
	BaseCommandInteraction,
	Client,
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu,
} from 'discord.js';

import logFile from '../../globalUtils/logFile';
import infoMessageEmbed, { types } from '../../globalUtils/infoMessageEmbed';
import { Command } from '../Command';
import { getUserRole } from '../../supabase/supabaseFunctions/users';
import { checkServerExists } from '../../supabase/supabaseFunctions/servers';
import commandIds from '../../commandIds';
import errorMessageTemplate from '../../globalUtils/errorMessageTemplate';
import botConfig from '../../botConfig';

const createEvent: Command = {
	name: 'createevent',
	description: 'Create event',
	type: 'CHAT_INPUT',
	run: async (client: Client, interaction: BaseCommandInteraction) => {
		try {
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
					.setFooter({ text: 'Use /support to seek support if required.' })
					.setTimestamp();

				return await interaction.reply({
					embeds: [embed],
				});
			}

			// check user role in DB
			const userRoleDB: any = await getUserRole({
				discordUserId: interaction.user.id,
				discordServerId: interaction.guild!.id,
			});

			if (
				userRoleDB.length === 0 ||
				(userRoleDB[0]['roleId'] !== 3 && userRoleDB[0]['roleId'] !== 2)
			) {
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

			const selectMenuOptions: Array<{
				label: string;
				description: string;
				value: string;
			}> = [
				{
					label: 'Create normal event',
					description: 'Create normal event with no team feature',
					value: 'createEvent',
				},
				{
					label: 'Create team event',
					description: 'Create team event with team creation feature',
					value: 'createTeamEvent',
				},
			];

			const selectMenu = new MessageActionRow().addComponents(
				new MessageSelectMenu()
					.setCustomId('selectEventType')
					.setPlaceholder('Select event type you would like to create')
					.addOptions(selectMenuOptions),
			);

			return await interaction.reply({
				embeds: [
					infoMessageEmbed({
						title: 'Select event type you would like to create',
					}),
				],
				ephemeral: true,
				components: [selectMenu],
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
				file: 'createEvent',
			});
		}
	},
};

export default createEvent;
