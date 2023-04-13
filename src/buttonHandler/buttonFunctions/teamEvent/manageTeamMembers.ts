import fs from 'fs';

import { Client, ButtonInteraction, MessageEmbed } from 'discord.js';

import { ButtonFunction } from '../../ButtonStructure';
import infoMessageEmbed from '../../../globalUtils/infoMessageEmbed';
import { addPlayer } from '../../../supabase/supabaseFunctions/teamPlayers';
import { checkTeamExists } from '../../../supabase/supabaseFunctions/teams';
import { removePlayer } from '../../../supabase/supabaseFunctions/teamPlayers';

const manageTeamMembers: ButtonFunction = {
	customId: 'manageTeamMembers',
	run: async (client: Client, interaction: ButtonInteraction) => {
		try {
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

export default manageTeamMembers;
