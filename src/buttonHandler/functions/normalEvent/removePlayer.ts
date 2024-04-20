import {
	Client,
	ButtonInteraction,
	MessageEmbed,
	MessageActionRow,
	MessageSelectMenu,
} from 'discord.js';

import logFile from '../../../globalUtils/logFile';
import { ButtonFunction } from '../../Button';
import infoMessageEmbed, { types } from '../../../globalUtils/infoMessageEmbed';
import { getAllPlayers } from '../../../supabase/supabaseFunctions/singlePlayers';
import { getUserRole } from '../../../supabase/supabaseFunctions/users';
import errorMessageTemplate from '../../../globalUtils/errorMessageTemplate';
import botConfig from '../../../botConfig';

const removePlayer: ButtonFunction = {
	customId: 'removePlayer',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			await interaction.reply({
				content: ':hourglass_flowing_sand:  Processing...',
				ephemeral: true,
			});

			// check user role in DB
			const userRoleDB: any = await getUserRole({
				discordUserId: interaction.user.id,
				discordServerId: interaction.guild!.id,
			});

			if (
				userRoleDB.length === 0 ||
				(userRoleDB[0]['roleId'] !== 3 && userRoleDB[0]['roleId'] !== 2)
			) {
				return await interaction.editReply({
					embeds: [
						infoMessageEmbed({
							title: ':warning: You are not allowed to use this button!',
							type: types.ERROR,
						}),
					],
					content: ' ',
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
				return interaction.editReply({
					embeds: [
						infoMessageEmbed({
							title: ':warning: There are no players to remove!',
							type: types.ERROR,
						}),
					],
					content: ' ',
				});

			const selectMenuOptions: Array<{
				label: string;
				description: string;
				value: string;
			}> = [];

			players!.forEach(
				(tp: { username: string; userId: string }, i: number) => {
					if (tp.username === interaction.user.username) return;

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
				.setColor(botConfig.color.default)
				.setFooter({ text: `${footer}` })
				.setTimestamp();

			await interaction.editReply({
				embeds: [selectMessageEmbed],
				components: [selectMenu],
				content: ' ',
			});
		} catch (err) {
			await interaction.editReply({
				embeds: [
					infoMessageEmbed({
						title: errorMessageTemplate().title,
						description: errorMessageTemplate().description,
						type: types.ERROR,
					}),
				],
				content: ' ',
			});

			logFile({
				error: err,
				folder: 'buttonHandler/functions',
				file: 'normalEvent/removePlayer',
			});
		}
	},
};

export default removePlayer;
