import fs from 'fs';

import {
	Client,
	ButtonInteraction,
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu,
} from 'discord.js';

import { ButtonFunction } from '../../ButtonStructure';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';
import { getAllPlayers } from '../../../supabase/supabaseFunctions/singlePlayers';
import { getUserRole } from '../../../supabase/supabaseFunctions/users';
import errorMessageTemplate from '../../../globalUtils/errorMessageTemplate';

const removePlayer: ButtonFunction = {
	customId: 'removePlayer',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
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
						infoMessageEmbed(
							':warning: You are not allowed to run this command!',
							'WARNING',
						),
					],
					ephemeral: true,
				});
			}

			const footer = interaction.message.embeds[0].footer?.text;
			const eventId: string | any =
				interaction.message.embeds[0].footer?.text.split(': ')[1];

			const players: [{ username: string; userId: string }] | any =
				await getAllPlayers({
					eventId: parseInt(eventId),
				});

			if (!(players!.length > 0))
				return interaction.reply({
					embeds: [
						infoMessageEmbed(
							'There are no players to remove!',
							'WARNING',
						),
					],
					ephemeral: true,
				});

			const selectMenuOptions: Array<{
				label: string;
				description: string;
				value: string;
			}> = [];

			players!.forEach(
				(tp: { username: string; userId: string }, i: number) => {
					if (tp.username === interaction.user.tag) return;

					selectMenuOptions.push({
						label: tp.username,
						description: `Remove ${tp.username}`,
						value: `${tp.username}||${tp.userId}`,
					});
				},
			);

			const selectMenu = new MessageActionRow().addComponents(
				new MessageSelectMenu()
					.setCustomId('removePlayer')
					.setPlaceholder('Select a player to be removed')
					.addOptions(selectMenuOptions),
			);

			const selectMessageEmbed = new MessageEmbed()
				.setTitle('Select team player to be removed')
				.setColor('#3A9CE2')
				.setFooter({ text: `${footer}` })
				.setTimestamp();

			await interaction.reply({
				embeds: [selectMessageEmbed],
				ephemeral: true,
				components: [selectMenu],
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
					`${new Date()} : Something went wrong in buttonFunctions/normalEvent/removePlayers.ts \n Actual error: ${err} \n \n`,
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

export default removePlayer;
