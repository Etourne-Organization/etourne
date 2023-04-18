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

const removePlayer: ButtonFunction = {
	customId: 'removePlayer',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
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
							'There are no  players to remove!',
							'WARNING',
						),
					],
					ephemeral: true,
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

export default removePlayer;
