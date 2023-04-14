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
import { addPlayer } from '../../../supabase/supabaseFunctions/teamPlayers';
import { checkTeamExists } from '../../../supabase/supabaseFunctions/teams';
import {
	removePlayer,
	getTeamPlayers,
} from '../../../supabase/supabaseFunctions/teamPlayers';

const removeTeamPlayer: ButtonFunction = {
	customId: 'removeTeamPlayer',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
			const teamId: string | any =
				interaction.message.embeds[0].footer?.text.split(': ')[2];

			const teamPlayers: [string] | any = await getTeamPlayers({
				teamId: parseInt(teamId),
			});

			if (!(teamPlayers.length > 0))
				return interaction.reply({
					embeds: [
						infoMessageEmbed(
							'There are no team players to remove!',
							'WARNING',
						),
					],
					ephemeral: true,
				});

			let selectMenuOptions: [
				{ label: string; description: string; value: string },
			] = [{ label: ' ', description: ' ', value: ' ' }];

			teamPlayers.forEach((tp: string, i: number) => {
				selectMenuOptions[i] = { label: tp, description: tp, value: tp };
			});

			const selectMenu = new MessageActionRow().addComponents(
				new MessageSelectMenu()
					.setCustomId('removeTeamPlayer')
					.setPlaceholder('Select a player to be removed')
					.addOptions(selectMenuOptions),
			);

			await interaction.reply({
				embeds: [infoMessageEmbed('Select team member to be removed')],
				ephemeral: true,
				components: [selectMenu],
			});
		} catch (err) {
			try {
				fs.appendFile(
					'logs/crash_logs.txt',
					`${new Date()} : Something went wrong in buttonFunctions/teamEvent/manageTeamMembers.ts \n Actual error: ${err} \n \n`,
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

export default removeTeamPlayer;
